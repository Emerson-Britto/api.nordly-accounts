"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memory_cache_1 = __importDefault(require("memory-cache"));
const moment_1 = __importDefault(require("moment"));
const helpers_1 = require("../../helpers");
const accountController_1 = __importDefault(require("../../controllers/accountController"));
const securityController_1 = __importDefault(require("../../controllers/securityController"));
const mailController_1 = __importDefault(require("../../controllers/mailController"));
(async () => {
    console.log(await accountController_1.default.getList());
})();
const createAccount = async (req, res) => {
    const { newUser, deviceData = null } = req.body;
    if (!newUser)
        return res.status(401).json({ msg: "invalid form!" });
    const hasError = await (0, helpers_1.formValidator)(newUser);
    const invalidDevice = !deviceData || !deviceData.locationData.YourFuckingIPAddress || !deviceData.platform;
    if (hasError)
        return res.status(401).json({ msg: 'account was denied' });
    if (invalidDevice)
        return res.status(401).json({ msg: 'Unknown Device Data' });
    //delete newUser.rePassword;
    //newUser.passwordHash = await securityController.getHash(newUser.password);
    try {
        newUser.lastSeen = (0, moment_1.default)().unix();
        newUser.verified = 0;
        const dbUserData = await accountController_1.default.add(newUser);
        const loginData = {
            status: "from Sign-Up",
            mail: dbUserData.mail,
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
        memory_cache_1.default.put(dbUserData.mail, loginData, 5 * 60000); // 5 minutes.
        res.status(200).json({ socketCode });
    }
    catch (err) {
        res.status(401).json({ msg: err });
    }
};
exports.default = createAccount;
// interface deviceData {
//   userAgent:string;
//   platform:string;
//   app: {
//     appName:string;
//     appCodeName:string;
//     appVersion:string;
//     language:string;
//     doNotTrack:string;
//     cookieEnabled:string;
//   };
//   locationData:any;
// }
