import bcrypt from 'bcrypt';
import redis from '../../common/redis';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { InvalidArgumentError } from '../../common/error';


const KEY = process.env.JWT_SIGN_KEY;

class SecurityController {
  constructor() {}

  async getHash(data) {
    const cost = 12;
    return bcrypt.hash(data, cost);
  },

  async compareHash(data, dataHash) {
    return bcrypt.compare(data, dataHash);
  },

  async createAccessToken(account:DBAccount, deviceData:any) {
    try {
      const { id, displayName } = account;
      const payload = {
        uiidb: id,
        userNameINF: displayName
      };

      const token = jwt.sign(payload, KEY);
      const expireat = moment().add(15, 'd').unix();
      deviceData.lastAccess = moment().unix();

      await redis.set(token, JSON.stringify(deviceData));
      redis.expiresAt(token, expireat);
      return token;
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError('token has not been generated!');
    }
  },

  async getAccessTokenData(accessToken:String){
    return redis.get(accessToken);
  },

  async createTempCode(mail:String, temp?:Number=15, min?:Number=100000, max?:Number=999999) {
    if (!mail) throw new InvalidArgumentError('mail is required!');
    const code:Number = Math.floor(Math.random() * (max - min) + min);

    await redis.set(mail, code);
    const expireat:Number = moment().add(temp, 'm').unix();
    redis.expiresAt(mail, expireat);
    return code;
  },

  async isValidTempCode(mail, code) {
    const dbCode = await redis.get(mail);

    if (dbCode === null) {
      throw new InvalidArgumentError('Code expired or never existed!');
    }

    if (dbCode == code) {
      await redis.del(mail);
      return true;
    }
    return false;
  },

  async updateTokenLastSeen(accessToken:String) {
    const deviceData = redis.get(accessToken);
    deviceData.lastAccess = moment().unix();
    await redis.set(accessToken, deviceData);
    const expireat = moment().add(15, 'd').unix();
    redis.expireAt(accessToken, expireat);
  },

  async deleteToken(accessToken:String) {
    try {
      await redis.del(accessToken);
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError('Devices has not been removed!');
    }
  },

  decoderToken(accessToken:String) {
    return jwt.verify(accessToken, KEY);
  },

  async verifyAccessToken(accessToken:String) {
    const result = await redis.exists(accessToken);
    if (result === 1) return this.decoderToken(accessToken);
    throw new InvalidArgumentError('invalid token!');
  },

  async revokeInvalidDevices(accountDevices) {
    let devices = JSON.parse(accountDevices);
    for(let i=0; i < devices.length; i++) {
      let device = devices[i];
      const result = await redis.exists(device);
      if (!result) {
        devices = devices.filter(value => value !== device);
      }
    }
    return JSON.stringify(devices);
  },

  async revokeAllDevices(accountDevices) {
    let devices = JSON.parse(accountDevices);
    for(let i=0; i < devices.length; i++) {
      let device = devices[i];
      await this.deleteToken(device);
      devices = devices.filter(value => value !== device);
    }
    return JSON.stringify(devices);
  },
}

const securityController = new securityController();
export default securityController;
