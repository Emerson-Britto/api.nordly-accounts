"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const redis_1 = __importDefault(require("../dataBases/redis"));
const error_1 = require("../common/error");
const redisDB = redis_1.default.connection();
const KEY = process.env.JWT_SIGN_KEY;
class SecurityController {
    constructor() { }
    async getHash(data) {
        const cost = 12;
        return bcrypt_1.default.hash(data, cost);
    }
    async compareHash(data, dataHash) {
        return bcrypt_1.default.compare(data, dataHash);
    }
    async createAccessToken(account, deviceData) {
        try {
            const { id, username } = account;
            const payload = {
                uuidb: id,
                dName: username
            };
            if (!KEY)
                throw new error_1.InternalServerError('unavailable service!');
            const accessToken = jsonwebtoken_1.default.sign(payload, KEY);
            const expireat = (0, moment_1.default)().add(15, 'd').unix();
            deviceData.lastAccess = (0, moment_1.default)().unix();
            await redisDB.set(`${account.mail}::${accessToken}`, JSON.stringify(deviceData));
            redisDB.expireAt(`${account.mail}::${accessToken}`, expireat);
            return accessToken;
        }
        catch (error) {
            console.error(error);
            throw new error_1.InvalidArgumentError('token has not been generated!');
        }
    }
    async createToken(mail, name = "temp_token", temp = 5) {
        if (!mail)
            throw new error_1.InvalidArgumentError('mail is required!');
        const code = (0, uuid_1.v4)();
        await redisDB.set(`${mail}::${name}`, code);
        const expireat = (0, moment_1.default)().add(temp, 'm').unix();
        redisDB.expireAt(`${mail}::${name}`, expireat);
        return code;
    }
    async isValidToken(mail, code, name = "temp_token") {
        const dbCode = await redisDB.get(`${mail}::${name}`);
        if (dbCode == code) {
            await redisDB.del(`${mail}::${name}`);
            return true;
        }
        return false;
    }
    async updateTokenLastSeen(account, accessToken) {
        const slotKey = `${account.mail}::${accessToken}`;
        const ttlCommand = ['TTL', `${account.mail}::${accessToken}`];
        const deviceDataStr = await redisDB.get(slotKey);
        if (!deviceDataStr)
            throw new error_1.InvalidArgumentError('invalid token!');
        const deviceData = JSON.parse(deviceDataStr);
        deviceData.lastAccess = (0, moment_1.default)().unix();
        const tokenTTL = await redisDB.sendCommand(ttlCommand);
        const expireat = (0, moment_1.default)().add(Number(tokenTTL), 's').unix();
        await redisDB.set(slotKey, JSON.stringify(deviceData));
        redisDB.expireAt(slotKey, expireat);
    }
    async deleteToken(tokenKey) {
        try {
            await redisDB.del(tokenKey);
        }
        catch (error) {
            console.error(error);
            throw new error_1.InvalidArgumentError('Token has not been removed!');
        }
    }
    async decoderToken(accessToken) {
        if (!KEY)
            throw new error_1.InternalServerError('unavailable service!');
        const decodedToken = await jsonwebtoken_1.default.verify(accessToken, KEY);
        return decodedToken;
    }
    async verifyAccessToken(accessToken) {
        const command = ['SCAN', '0', 'MATCH', `*::${accessToken}`, 'COUNT', '10000'];
        const result = await redisDB.sendCommand(command);
        const exists = Boolean(result[1].length);
        if (!exists)
            throw new error_1.InvalidTokenError('invalid token!');
        return this.decoderToken(accessToken);
    }
    async revokeToken(accessToken) {
        const command = ['SCAN', '0', 'MATCH', `*::${accessToken}`, 'COUNT', '10000'];
        const result = await redisDB.sendCommand(command);
        const keys = result[1];
        const key = keys[0];
        await this.deleteToken(key);
    }
    async revokeAllTokens(account) {
        const command = ['SCAN', '0', 'MATCH', `${account.mail}::*`, 'COUNT', '10000'];
        const result = await redisDB.sendCommand(command);
        const keys = result[1];
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            await this.deleteToken(key);
        }
        return true;
    }
    async allTokensData({ account, includeThis }) {
        const devices = [];
        const command = ['SCAN', '0', 'MATCH', `${account.mail}::*`, 'COUNT', '10000'];
        const result = await redisDB.sendCommand(command);
        const keys = result[1];
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let token = key.split("::")[1];
            let thisDevice = includeThis && key.includes(includeThis);
            let deviceDataStr = await redisDB.get(key);
            if (!deviceDataStr)
                continue;
            let deviceData = JSON.parse(deviceDataStr);
            deviceData.id = token.split(".")[0];
            if (thisDevice) {
                devices.unshift(deviceData);
            }
            else {
                devices.push(deviceData);
            }
            ;
        }
        return devices;
    }
}
const securityController = new SecurityController();
exports.default = securityController;
