"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountController_1 = __importDefault(require("../../controllers/accountController"));
const redis_1 = __importDefault(require("../../dataBases/redis"));
const securityController_1 = __importDefault(require("../../controllers/securityController"));
const redisDB = redis_1.default.connection();
const accountData = async (req, res) => {
    const accessToken = req.headers.authorization;
    const { part = '' } = req.query || {};
    const partList = String(part).split(',');
    const data = {};
    try {
        const { uuidb } = await securityController_1.default.verifyAccessToken(String(accessToken));
        const account = await accountController_1.default.getById(uuidb);
        if (partList.includes('currentDevice')) {
            const tokenData = await redisDB.get(`${account.mail}::${accessToken}`);
            data['currentDevice'] = JSON.parse(tokenData || '');
        }
        if (partList.includes('account')) {
            data['account'] = account;
        }
        if (partList.includes('devices')) {
            data['devices'] = await securityController_1.default.allTokensData({
                includeThis: accessToken,
                account
            });
        }
        res.status(200).json(data);
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'invalid token or token provide expired data' });
    }
};
exports.default = accountData;
