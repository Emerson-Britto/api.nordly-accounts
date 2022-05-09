"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Model = require('./accountModel');
var moment = require('moment');
var securityController = require('./securityController');
var redisDB = require('../../common/redisDB');
var InvalidArgumentError = require('../../common/error').InvalidArgumentError;
console.log(new Date());
module.exports = {
    getList: function () {
        return Model.findAll({ raw: true });
    },
    add: function (account) {
        return Model.create(account);
    },
    verifyAccount: function (mail, code) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, securityController.isValidTempCode(mail, code)];
                    case 1:
                        result = _a.sent();
                        if (!(result === true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Model.update({ verified: 1 }, { where: { mail: mail } })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    },
    setDevice: function (_a, deviceData) {
        var id = _a.id, displayName = _a.displayName;
        return __awaiter(this, void 0, void 0, function () {
            var account, currentDevices, accessToken, devices, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Model.findOne({ where: { id: Number(id) } })];
                    case 1:
                        account = _b.sent();
                        currentDevices = JSON.parse(account.devices);
                        return [4 /*yield*/, securityController.createAccessToken({ id: id, displayName: displayName }, deviceData)];
                    case 2:
                        accessToken = _b.sent();
                        devices = JSON.stringify(__spreadArray(__spreadArray([], currentDevices, true), [accessToken], false));
                        return [4 /*yield*/, Model.update({ devices: devices }, { where: { id: Number(id) } })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, accessToken];
                    case 4:
                        error_1 = _b.sent();
                        console.error(error_1);
                        throw new InvalidArgumentError('Devices has not been added!');
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    listDevices: function (_a) {
        var _b = _a.id, id = _b === void 0 ? false : _b, _c = _a.mail, mail = _c === void 0 ? false : _c;
        return __awaiter(this, void 0, void 0, function () {
            var account, devices, devicesListData, i, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (!id && !mail)
                            return [2 /*return*/];
                        account = {};
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, Model.findOne({ where: { id: Number(id) } })];
                    case 1:
                        account = _h.sent();
                        _h.label = 2;
                    case 2:
                        if (!(mail && !id)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Model.findOne({ where: { mail: Number(mail) } })];
                    case 3:
                        account = _h.sent();
                        _h.label = 4;
                    case 4:
                        devices = JSON.parse(account.devices);
                        devicesListData = [];
                        i = 0;
                        _h.label = 5;
                    case 5:
                        if (!(i < devices.length)) return [3 /*break*/, 8];
                        _e = (_d = devicesListData).push;
                        _g = (_f = JSON).parse;
                        return [4 /*yield*/, redisDB.get(devices[i])];
                    case 6:
                        _e.apply(_d, [_g.apply(_f, [_h.sent()])]);
                        _h.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, devicesListData];
                }
            });
        });
    },
    removeDevice: function (_a, accessToken) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            var account, currentDevices, devices, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Model.findOne({ where: { id: Number(id) } })];
                    case 1:
                        account = _b.sent();
                        currentDevices = JSON.parse(account.devices);
                        return [4 /*yield*/, securityController.deleteToken(accessToken)];
                    case 2:
                        _b.sent();
                        devices = currentDevices.filter(function (value) { return value !== accessToken; });
                        devices = JSON.stringify(devices);
                        return [4 /*yield*/, Model.update({ devices: devices }, { where: { id: Number(id) } })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        console.error(error_2);
                        throw new InvalidArgumentError('Devices has not been removed!');
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    dataExists: function (_a) {
        var _b = _a.userName, userName = _b === void 0 ? false : _b, _c = _a.mail, mail = _c === void 0 ? false : _c;
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        exists = false;
                        if (!mail) return [3 /*break*/, 2];
                        return [4 /*yield*/, Model.findOne({ where: { mail: mail } })];
                    case 1:
                        exists = _d.sent();
                        _d.label = 2;
                    case 2:
                        if (!userName) return [3 /*break*/, 4];
                        return [4 /*yield*/, Model.findOne({ where: { userName: userName } })];
                    case 3:
                        exists = _d.sent();
                        _d.label = 4;
                    case 4:
                        if (!exists)
                            return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    },
    getById: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Model.findOne({ where: { id: Number(id) } })];
                    case 1:
                        account = _a.sent();
                        if (account)
                            return [2 /*return*/, account];
                        throw new InvalidArgumentError('No Found data with this Id!');
                }
            });
        });
    },
    getByMail: function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Model.findOne({ where: { mail: mail } })];
                    case 1:
                        account = _a.sent();
                        if (account)
                            return [2 /*return*/, account];
                        throw new InvalidArgumentError('No Found data with this mail!');
                }
            });
        });
    },
    update: function (_a, update) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Model.update(update, { where: { id: Number(id) } })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        console.error(error_3);
                        throw new InvalidArgumentError('Data has not been updated!');
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    lastSeen: function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var account, accountlastSeen, currentTime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Model.findOne({ where: { mail: mail } })];
                    case 1:
                        account = _a.sent();
                        if (account) {
                            throw new InvalidArgumentError('No Found data with this mail!');
                        }
                        accountlastSeen = parseInt(account.lastSeen);
                        currentTime = moment().unix();
                        return [2 /*return*/, currentTime - accountlastSeen]; // result: seconds
                }
            });
        });
    },
    updateLastSeen: function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var newLastSeen, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newLastSeen = moment().unix();
                        return [4 /*yield*/, Model.update({ lastSeen: newLastSeen }, { where: { mail: mail } })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error(error_4);
                        throw new InvalidArgumentError("Data has not been updated!");
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    remove: function (id) {
        return Model.destroy({ where: { id: Number(id) } });
    },
    dropOffAccounts: function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var result, accountsList, i, account, accountLastSeen;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = redisDB.exists("noVerifyOffAccounts");
                        if (result && !options.force)
                            return [2 /*return*/];
                        console.log('>> DROPPING DB...');
                        return [4 /*yield*/, this.getList()];
                    case 1:
                        accountsList = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < accountsList.length)) return [3 /*break*/, 5];
                        account = accountsList[i];
                        accountLastSeen = moment().unix() - parseInt(account.lastSeen);
                        if (!(accountLastSeen > (15 * 24 * 60 * 60) || options.force)) return [3 /*break*/, 4];
                        return [4 /*yield*/, securityController.revokeAllDevices(account.devices)];
                    case 3:
                        _a.sent();
                        this.remove(account.id);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        redisDB.set("noVerifyOffAccounts", ";)");
                        redisDB.expiresAt("noVerifyOffAccounts", moment().add(30, 'm').unix());
                        console.log('>> DROPPING DB FINISHED');
                        return [2 /*return*/];
                }
            });
        });
    },
};
