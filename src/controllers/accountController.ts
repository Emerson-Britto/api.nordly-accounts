import moment from 'moment';
import { RedisClientType } from 'redis';
import { Account, DBAccount } from '../common/interfaces';
import { AccountModel } from '../models';
import securityController from './securityController';
import redisDB from '../dataBases/redis';
import { InvalidArgumentError } from '../common/error';

class AccountController {
  redis: RedisClientType;

  constructor() {
    this.redis = redisDB();
  }

  getList() {
    return AccountModel.findAll({ raw: true });
  }

  add(account:Account) {
    return AccountModel.create(account);
  }

  async getById(id:String) {
    const account = await AccountModel.findOne({ where: {id: Number(id)} });

    if(account) return account;

    throw new InvalidArgumentError('No Found data with this Id!');
  }

  async getByMail(mail:String) {
    const account = await AccountModel.findOne({ where: { mail: mail }});

    if(account) return account;

    throw new InvalidArgumentError('No Found data with this mail!');
  }

  async update({ id }:{ id:String }, update:any) {
    try {
      await AccountModel.update(update, { where: { id: Number(id) }})
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError('Data has not been updated!');
    }
  }

  async lastSeen(mail:String) {
    const account = await AccountModel.findOne({ where: { mail: mail } });
    if(account) {
      throw new InvalidArgumentError('No Found data with this mail!');
    }
    let accountlastSeen = parseInt(account.lastSeen);

    let currentTime = moment().unix();

    return currentTime - accountlastSeen; // result: seconds
  }

  async updateLastSeen(mail:String) {
    try {
      const newLastSeen = moment().unix();
      await AccountModel.update({ lastSeen: newLastSeen }, { where: { mail: mail }});
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError("Data has not been updated!");
    }
  }

  remove(id:String) {
    return AccountModel.destroy({ where: { id: Number(id) } })
  }

  async dropOffAccounts(options?:{ force?:boolean }) {
    const { force=false } = options || {};
    const result = await this.redis.exists("noVerifyOffAccounts");

    if (result && !force) return;

    console.log('>> DROPPING DB...');

    const accountsList = await this.getList();

    for(let i=0; i < accountsList.length; i++) {
      let account = accountsList[i];
      let accountLastSeen = moment().unix() - parseInt(account.lastSeen);
      if (accountLastSeen > (15 * 24 * 60 * 60) || force) {
        await securityController.revokeAllDevices(account.devices);
        this.remove(account.id);
      }
    }

    this.redis.set("noVerifyOffAccounts", ";)");
    this.redis.expireAt("noVerifyOffAccounts", moment().add(30, 'm').unix())
    console.log('>> DROPPING DB FINISHED');
  }
}

const accountController = new AccountController();
export default accountController;
