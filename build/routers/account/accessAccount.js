"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memory_cache_1 = __importDefault(require("memory-cache"));
const moment_1 = __importDefault(require("moment"));
const securityController_1 = __importDefault(require("../../controllers/securityController"));
const mailController_1 = __importDefault(require("../../controllers/mailController"));
const accessAccount = async (req, res) => {
    const account = req.body.account;
    const deviceData = req.body.deviceData;
    const loginData = {
        status: "from Sign-In",
        mail: account.mail,
        ip: deviceData.locationData.YourFuckingIPAddress,
        date: (0, moment_1.default)().format('LL'),
        time: (0, moment_1.default)().format('LTS'),
        location: deviceData.locationData.YourFuckingLocation,
        ISP: deviceData.locationData.YourFuckingISP,
        hostname: deviceData.locationData.YourFuckingHostname,
        countryCode: deviceData.locationData.YourFuckingCountryCode,
        os: deviceData.platform,
        userAgent: deviceData.userAgent
    };
    await mailController_1.default.sendVerificationMail(loginData);
    const socketCode = await securityController_1.default.createToken(loginData.mail, "socket_code");
    memory_cache_1.default.put(account.mail, loginData, 5 * 60000); // 5 minutes.
    res.status(200).json({ socketCode });
};
exports.default = accessAccount;
