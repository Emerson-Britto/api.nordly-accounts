import moment from 'moment';
import { RedisClientType } from 'redis';
import { Account, DBAccount } from '../common/interfaces';
import { AccountModel } from '../models';
import { sleep } from '../helpers';
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

  async getBy(property:any) {
    return AccountModel.findOne({ where: property });
  }

  async getById(id:string | number) {
    const account = await AccountModel.findOne({ where: {id: Number(id)}});
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

  async dropInactiveAccounts() {
    const tenMinutes = 10 * 60000;
    const twentyMinutes = 20 * 60;
    const fifteenDays = 15 * 24 * 60 * 60;

    console.log("AccountController -> dropInactiveAccounts()");

    try {
      const accounts:DBAccount  [] = await this.getList();
      for(let i=0; i < accounts.length; i++) {
        let account:DBAccount = accounts[i];
        let accountLastSeen:Number = moment().unix() - Number(account.lastSeen);
        let accountVerified:Number = Number(account.verified);
        if (
          (accountLastSeen > twentyMinutes && accountVerified === 0) ||
          (accountLastSeen > fifteenDays)
        ) {
          await securityController.revokeAllTokens(account);
          this.remove(account.id);
        }
      }
      await sleep(() => this.dropInactiveAccounts(), tenMinutes);
    } catch(err) {
      console.error(err);
      await sleep(() => this.dropInactiveAccounts(), tenMinutes);
    }
  }
}

const accountController = new AccountController();
export default accountController;
