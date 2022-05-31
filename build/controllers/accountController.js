"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const models_1 = require("../models");
const helpers_1 = require("../helpers");
const securityController_1 = __importDefault(require("./securityController"));
const redis_1 = __importDefault(require("../dataBases/redis"));
const error_1 = require("../common/error");
const redisDB = redis_1.default.connection();
class AccountController {
    constructor() { }
    getList() {
        return models_1.AccountModel.findAll({ raw: true });
    }
    add(account) {
        return models_1.AccountModel.create(account);
    }
    async getBy(property) {
        return models_1.AccountModel.findOne({ where: property });
    }
    async getById(id) {
        const account = await models_1.AccountModel.findOne({ where: { id: Number(id) } });
        if (account)
            return account;
        throw new error_1.InvalidArgumentError('No Found data with this Id!');
    }
    async getByMail(mail) {
        const account = await models_1.AccountModel.findOne({ where: { mail: mail } });
        if (account)
            return account;
        throw new error_1.InvalidArgumentError('No Found data with this mail!');
    }
    async update({ id }, update) {
        try {
            await models_1.AccountModel.update(update, { where: { id: Number(id) } });
        }
        catch (error) {
            console.error(error);
            throw new error_1.InvalidArgumentError('Data has not been updated!');
        }
    }
    async lastSeen(mail) {
        const account = await models_1.AccountModel.findOne({ where: { mail: mail } });
        if (!account)
            throw new error_1.InvalidArgumentError('No Found data with this mail!');
        const accountlastSeen = Number(account.lastSeen);
        const currentTime = (0, moment_1.default)().unix();
        return currentTime - accountlastSeen; // result: seconds
    }
    async updateLastSeen(mail) {
        try {
            const newLastSeen = (0, moment_1.default)().unix();
            await models_1.AccountModel.update({ lastSeen: newLastSeen }, { where: { mail: mail } });
        }
        catch (error) {
            console.error(error);
            throw new error_1.InvalidArgumentError("Data has not been updated!");
        }
    }
    remove(id) {
        return models_1.AccountModel.destroy({ where: { id: id } });
    }
    async dropInactiveAccounts() {
        const tenMinutes = 10 * 60000;
        const twentyMinutes = 20 * 60;
        const fifteenDays = 15 * 24 * 60 * 60;
        console.log("AccountController -> dropInactiveAccounts()");
        try {
            const accounts = await this.getList();
            for (let i = 0; i < accounts.length; i++) {
                let account = accounts[i];
                let accountLastSeen = (0, moment_1.default)().unix() - Number(account.lastSeen);
                let accountVerified = Number(account.verified);
                if ((accountLastSeen > twentyMinutes && accountVerified === 0) ||
                    (accountLastSeen > fifteenDays)) {
                    await securityController_1.default.revokeAllTokens(account);
                    this.remove(account.id);
                }
            }
            await (0, helpers_1.sleep)(() => this.dropInactiveAccounts(), tenMinutes);
        }
        catch (err) {
            console.error(err);
            await (0, helpers_1.sleep)(() => this.dropInactiveAccounts(), tenMinutes);
        }
    }
}
const accountController = new AccountController();
exports.default = accountController;
