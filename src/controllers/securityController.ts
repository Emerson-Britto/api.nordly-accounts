import bcrypt from 'bcrypt';
import redis from '../dataBases/redis';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { InvalidArgumentError, InternalServerError } from '../common/error';
import { DBAccount, TokenInfor } from '../common/interfaces';
const redisDB = redis.connection();


const KEY = process.env.JWT_SIGN_KEY;

class SecurityController {
  constructor() {}

  async getHash(data:string) {
    const cost = 12;
    return bcrypt.hash(data, cost);
  }

  async compareHash(data:string, dataHash:string) {
    return bcrypt.compare(data, dataHash);
  }

  async createAccessToken(account:DBAccount, deviceData:any) {
    try {
      const { id, displayName } = account;
      const payload = {
        uiidb: id,
        userNameINF: displayName
      };

      if (!KEY) throw new InternalServerError('unavailable service!');

      const token = jwt.sign(payload, KEY);
      const expireat = moment().add(15, 'd').unix();
      deviceData.lastAccess = moment().unix();

      await redisDB.set(token, JSON.stringify(deviceData));
      redisDB.expireAt(token, expireat);
      return token;
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError('token has not been generated!');
    }
  }

  async getAccessTokenData(accessToken:string){
    return redisDB.get(accessToken);
  }

  async createTempCode(mail:string, temp:number=15, min:number=100000, max:number=999999) {
    if (!mail) throw new InvalidArgumentError('mail is required!');
    const code:number = Math.floor(Math.random() * (max - min) + min);

    await redisDB.set(mail, code);
    const expireat:number = moment().add(temp, 'm').unix();
    redisDB.expireAt(mail, expireat);
    return code;
  }

  async isValidTempCode(mail:string, code:String) {
    const dbCode = await redisDB.get(mail);

    if (dbCode === null) {
      throw new InvalidArgumentError('Code expired or never existed!');
    }

    if (dbCode == code) {
      await redisDB.del(mail);
      return true;
    }
    return false;
  }

  async updateTokenLastSeen(accessToken:string) {
    const deviceDataStr:string | null = await redisDB.get(accessToken);
    if (!deviceDataStr) throw new InvalidArgumentError('invalid token!');
    const deviceData:TokenInfor = JSON.parse(deviceDataStr);
    deviceData.lastAccess = moment().unix();
    await redisDB.set(accessToken, JSON.stringify(deviceData));
    const expireat = moment().add(15, 'd').unix();
    redisDB.expireAt(accessToken, expireat);
  }

  async deleteToken(accessToken:string) {
    try {
      await redisDB.del(accessToken);
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError('Devices has not been removed!');
    }
  }

  decoderToken(accessToken:string) {
    if (!KEY) throw new InternalServerError('unavailable service!');
    return jwt.verify(accessToken, KEY);
  }

  async verifyAccessToken(accessToken:string) {
    const result = await redisDB.exists(accessToken);
    if (result === 1) return this.decoderToken(accessToken);
    throw new InvalidArgumentError('invalid token!');
  }

  async revokeAllTokens(account:DBAccount) {
    // for(let i=0; i < devices.length; i++) {
    //   let device = devices[i];
    //   await this.deleteToken(device);
    //   devices = devices.filter(value => value !== device);
    // }
    return true;
  }
}

const securityController = new SecurityController();
export default securityController;
