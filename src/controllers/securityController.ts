import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import redis from '../dataBases/redis';
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
      const { id, username } = account;
      const payload = {
        uuidb: id,
        dName: username
      };

      if (!KEY) throw new InternalServerError('unavailable service!');

      const accessToken = jwt.sign(payload, KEY);
      const expireat = moment().add(15, 'd').unix();
      deviceData.lastAccess = moment().unix();

      await redisDB.set(`${account.mail}::${accessToken}`, JSON.stringify(deviceData));
      redisDB.expireAt(`${account.mail}::${accessToken}`, expireat);
      return accessToken;
    } catch(error) {
      console.error(error);
      throw new InvalidArgumentError('token has not been generated!');
    }
  }

  async createTempCode(mail:string, name:string="temp_code", temp:number=5): Promise<string> {
    if (!mail) throw new InvalidArgumentError('mail is required!');
    const code:string = uuidv4();

    await redisDB.set(`${mail}::${name}`, code);
    const expireat:number = moment().add(temp, 'm').unix();
    redisDB.expireAt(`${mail}::${name}`, expireat);
    return code;
  }

  async isValidTempCode(mail:string, code:String, name:string="temp_code") {
    const dbCode = await redisDB.get(`${mail}::${name}`);
    if (dbCode == code) {
      await redisDB.del(`${mail}::${name}`);
      return true;
    }

    return false;
  }

  async updateTokenLastSeen(account:DBAccount, accessToken:string) {
    const deviceDataStr:string | null = await redisDB.get(`${account.mail}::${accessToken}`);
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
      throw new InvalidArgumentError('Token has not been removed!');
    }
  }

  async decoderToken(accessToken:string): Promise<string | JwtPayload> {
    if (!KEY) throw new InternalServerError('unavailable service!');
    const decodedToken = await jwt.verify(accessToken, KEY);
    return decodedToken;
  }

  async verifyAccessToken(accessToken:string): Promise<string | JwtPayload> {
    const command:string[] = ['SCAN', '0', 'MATCH', `*::${accessToken}`, 'COUNT', '10000'];
    const result:any[] = await redisDB.sendCommand(command);
    const exists = Boolean(result[1].length);
    if (exists) return this.decoderToken(accessToken);
    throw new InvalidArgumentError('invalid token!');
  }

  async revokeAllTokens(account:DBAccount) {
    const command:string[] = ['SCAN', '0', 'MATCH', `${account.mail}::*`, 'COUNT', '10000'];
    const result:any[] = await redisDB.sendCommand(command);
    const keys:string[] = result[1];
    for(let i=0; i < keys.length; i++) {
      let key:string = keys[i];
      await this.deleteToken(key);
    }
    return true;
  }
}

const securityController = new SecurityController();
export default securityController;
