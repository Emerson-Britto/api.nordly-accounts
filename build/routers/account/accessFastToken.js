"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("../../dataBases/redis"));
const error_1 = require("../../common/error");
const redisDB = redis_1.default.connection();
// TEMP
const accessFastToken = async (req, res) => {
    try {
        const { passToken = '' } = req.query || {};
        const isActiveToken = await redisDB.exists(`${passToken}`);
        if (!passToken || !isActiveToken)
            throw new error_1.InvalidArgumentError('invalid passToken!');
        const accessToken = await redisDB.get(`${passToken}`);
        res.status(200).send({ ACCESS_TOKEN: accessToken });
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ error });
    }
};
exports.default = accessFastToken;
