"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const redis_1 = __importDefault(require("../../dataBases/redis"));
const securityController_1 = __importDefault(require("../../controllers/securityController"));
const authorizedServices_1 = __importDefault(require("../../common/authorizedServices"));
const helpers_1 = require("../../helpers");
const error_1 = require("../../common/error");
const redisDB = redis_1.default.connection();
const createFastToken = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;
        const { afterUrl = '' } = req.query || {};
        if (!accessToken || !afterUrl)
            return res.status(401).send();
        const hasSomeAuthorization = authorizedServices_1.default
            .some(service => service.test((0, helpers_1.urlEncoding)(String(afterUrl)).decoder()));
        if (!hasSomeAuthorization)
            throw new error_1.InvalidService('service unauthorized!');
        await securityController_1.default.verifyAccessToken(String(accessToken));
        const key = 'tmpKey-' + (0, uuid_1.v4)();
        const expireat = (0, moment_1.default)().add(1, 'm').unix();
        await redisDB.set(key, String(accessToken));
        redisDB.expireAt(key, expireat);
        res.status(200).send({ KEY: key });
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ error });
    }
};
exports.default = createFastToken;
