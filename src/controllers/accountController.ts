import moment from 'moment';
import { RedisClientType } from 'redis';
import { Account, DBAccount } from '../common/interfaces';
import { AccountModel } from '../models';
import securityController from './securityController';
import redis from '../dataBases/redis';
import { InvalidArgumentError } from '../common/error';
const redisDB = redis.connection();

class AccountController {
  constructor() {}

  getList() {
    return AccountModel.findAll({ raw: true });
  }

  add(account:Account) {
    return AccountModel.create(account);
  }

  async getById(id:string | number) {
    const account = await AccountModel.findOne({ where: {id: Number(id)} });

    if(account) return account;

    throw new InvalidArgumentError('No Found data with this Id!');
  }

  async getByMail(mail:string) {
    const account = await AccountModel.findOne({ where: { mail: mail }});

    if(account) return account;

    throw new InvalidArgumentError('No Found data with this mail!');
  }

  async update({ id }:{ id:number }, update:any) {
    try {
      await AccountModel.update(update, { where: { id: Number(id) }})
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError('Data has not been updated!');
    }
  }

  async lastSeen(mail:string) {
    const account:DBAccount | null = await AccountModel.findOne({ where: { mail: mail }});
    if (!account) throw new InvalidArgumentError('No Found data with this mail!');
    const accountlastSeen = Number(account.lastSeen);
    const currentTime = moment().unix();
    return currentTime - accountlastSeen; // result: seconds
  }

  async updateLastSeen(mail:string) {
    try {
      const newLastSeen = moment().unix();
      await AccountModel.update({ lastSeen: newLastSeen }, { where: { mail: mail }});
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError("Data has not been updated!");
    }
  }

  remove(id:number) {
    return AccountModel.destroy({ where: { id: id }});
  }

  async dropOffAccounts(options?:{ force?:boolean }) {
    const { force=false } = options || {};
    const result = await redisDB.exists("noVerifyOffAccounts");
    if (result && !force) return;

    console.log('>> DROPPING DB...');

    const accountsList:DBAccount  [] = await this.getList();

    for(let i=0; i < accountsList.length; i++) {
      const account:DBAccount = accountsList[i];
      const accountLastSeen:Number = moment().unix() - Number(account.lastSeen);
      if (accountLastSeen > (15 * 24 * 60 * 60) || force) {
        await securityController.revokeAllTokens(account);
        this.remove(account.id);
      }
    }

    redisDB.set("noVerifyOffAccounts", ";)");
    redisDB.expireAt("noVerifyOffAccounts", moment().add(30, 'm').unix())
    console.log('>> DROPPING DB FINISHED');
  }
}

const accountController = new AccountController();
export default accountController;
