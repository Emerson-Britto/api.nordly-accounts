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
var bcrypt = require('bcrypt');
var redisDB = require('../../common/redisDB');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var InvalidArgumentError = require('../../common/error').InvalidArgumentError;
// SECRET KEY :)
var KEY = 'INFINITY_g9hZavvn3-1aWlkYiI6NiwiaWF0IjoxNjM4MjUwOTY-mU8okIbCuHuYwcrQwx9AAjX';
module.exports = {
    getHash: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var cost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cost = 12;
                        return [4 /*yield*/, bcrypt.hash(data, cost)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    compareHash: function (data, dataHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.compare(data, dataHash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    createAccessToken: function (_a, deviceData) {
        var id = _a.id, displayName = _a.displayName;
        return __awaiter(this, void 0, void 0, function () {
            var payload, token, expireat;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log({ displayName: displayName });
                        payload = {
                            uiidb: id,
                            userNameINF: displayName
                        };
                        token = jwt.sign(payload, KEY);
                        expireat = moment().add(15, 'd').unix();
                        deviceData.lastAccess = moment().unix();
                        return [4 /*yield*/, redisDB.set(token, JSON.stringify(deviceData))];
                    case 1:
                        _b.sent();
                        redisDB.expiresAt(token, expireat);
                        return [2 /*return*/, token];
                }
            });
        });
    },
    getAccessTokenData: function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, redisDB.get(token)];
            });
        });
    },
    createTempCode: function (mail, temp, min, max) {
        if (temp === void 0) { temp = 15; }
        if (min === void 0) { min = 100000; }
        if (max === void 0) { max = 999999; }
        return __awaiter(this, void 0, void 0, function () {
            var code, expireat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mail) {
                            throw new InvalidArgumentError('mail is required!');
                        }
                        code = Math.floor(Math.random() * (max - min) + min);
                        return [4 /*yield*/, redisDB.set(mail, code)];
                    case 1:
                        _a.sent();
                        expireat = moment().add(temp, 'm').unix();
                        redisDB.expiresAt(mail, expireat);
                        return [2 /*return*/, code];
                }
            });
        });
    },
    isValidTempCode: function (mail, code) {
        return __awaiter(this, void 0, void 0, function () {
            var dbCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, redisDB.get(mail)];
                    case 1:
                        dbCode = _a.sent();
                        if (dbCode === null) {
                            throw new InvalidArgumentError('Code expired or never existed!');
                        }
                        if (!(dbCode == code)) return [3 /*break*/, 3];
                        return [4 /*yield*/, redisDB.del(mail)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    },
    updateTokenLastSeen: function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceData, expireat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deviceData = redisDB.get(token);
                        deviceData.lastAccess = moment().unix();
                        return [4 /*yield*/, redisDB.set(token, deviceData)];
                    case 1:
                        _a.sent();
                        expireat = moment().add(15, 'd').unix();
                        redisDB.expireAt(token, expireat);
                        return [2 /*return*/];
                }
            });
        });
    },
    deleteToken: function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, redisDB.del(token)];
            });
        });
    },
    decoderToken: function (token) {
        return jwt.verify(token, KEY);
    },
    verifyAccessToken: function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, redisDB.exists(token)];
                    case 1:
                        result = _a.sent();
                        if (result === 1)
                            return [2 /*return*/, this.decoderToken(token)];
                        throw new InvalidArgumentError('invalid token!');
                }
            });
        });
    },
    revokeInvalidDevices: function (accountDevices) {
        return __awaiter(this, void 0, void 0, function () {
            var devices, _loop_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        devices = JSON.parse(accountDevices);
                        _loop_1 = function (i) {
                            var device, result;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        device = devices[i];
                                        return [4 /*yield*/, redisDB.exists(device)];
                                    case 1:
                                        result = _b.sent();
                                        if (!result) {
                                            devices = devices.filter(function (value) { return value !== device; });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < devices.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, JSON.stringify(devices)];
                }
            });
        });
    },
    revokeAllDevices: function (accountDevices) {
        return __awaiter(this, void 0, void 0, function () {
            var devices, _loop_2, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        devices = JSON.parse(accountDevices);
                        _loop_2 = function (i) {
                            var device;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        device = devices[i];
                                        return [4 /*yield*/, this_1.deleteToken(device)];
                                    case 1:
                                        _b.sent();
                                        devices = devices.filter(function (value) { return value !== device; });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < devices.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_2(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, JSON.stringify(devices)];
                }
            });
        });
    },
};
