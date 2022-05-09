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
var accountController = require('./accountController');
var redisDB = require('../../common/redisDB');
var securityController = require('./securityController');
var accountData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, part, data, partList, uiidb, _a, _b, _c, _d, _e, name, lastName, gender, birthDate, displayName, mail, lastSeen, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                token = req.query['accessToken'];
                part = req.query['part'];
                data = {};
                partList = part.split(',');
                return [4 /*yield*/, securityController.verifyAccessToken(token)];
            case 1:
                uiidb = (_h.sent()).uiidb;
                console.log(partList);
                if (!partList.includes('currentDevice')) return [3 /*break*/, 3];
                _a = data;
                _b = 'currentDevice';
                _d = (_c = JSON).parse;
                return [4 /*yield*/, redisDB.get(token)];
            case 2:
                _a[_b] = _d.apply(_c, [_h.sent()]);
                _h.label = 3;
            case 3:
                if (!partList.includes('account')) return [3 /*break*/, 5];
                return [4 /*yield*/, accountController.getById(Number(uiidb))];
            case 4:
                _e = _h.sent(), name = _e.name, lastName = _e.lastName, gender = _e.gender, birthDate = _e.birthDate, displayName = _e.displayName, mail = _e.mail, lastSeen = _e.lastSeen;
                data['account'] = { name: name, lastName: lastName, gender: gender, birthDate: birthDate, displayName: displayName, mail: mail, lastSeen: lastSeen };
                _h.label = 5;
            case 5:
                if (!partList.includes('allDevices')) return [3 /*break*/, 7];
                _f = data;
                _g = 'allDevices';
                return [4 /*yield*/, accountController.listDevices({ id: Number(uiidb) })];
            case 6:
                _f[_g] = _h.sent();
                _h.label = 7;
            case 7:
                res.status(200).json(data);
                return [2 /*return*/];
        }
    });
}); };
module.exports = accountData;
