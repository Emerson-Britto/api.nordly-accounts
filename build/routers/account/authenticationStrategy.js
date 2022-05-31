"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const moment_1 = __importDefault(require("moment"));
const passport_custom_1 = require("passport-custom");
const passport_http_bearer_1 = require("passport-http-bearer");
const accountController_1 = __importDefault(require("../../controllers/accountController"));
const securityController_1 = __importDefault(require("../../controllers/securityController"));
const error_1 = require("../../common/error");
passport_1.default.use('customStrategy', new passport_custom_1.Strategy(async (req, done) => {
    const { username = null, mail = null } = req.body?.user || {};
    const invalidForm = !username || !mail;
    try {
        if (invalidForm)
            throw new error_1.InvalidArgumentError('invalid form!');
        const account = await accountController_1.default.getByMail(mail);
        if (account.username != username) {
            throw new error_1.InvalidArgumentError('invalid username!!');
        }
        done(null, account);
    }
    catch (err) {
        console.error(err);
        done({ name: "InvalidArgumentError", msg: "invalid username and mail!" });
    }
}));
passport_1.default.use(new passport_http_bearer_1.Strategy(async (accessToken, done) => {
    console.log({ accessToken });
    try {
        const { uuidb } = await securityController_1.default.verifyAccessToken(accessToken);
        const account = await accountController_1.default.getById(uuidb);
        await securityController_1.default.updateTokenLastSeen(account, accessToken);
        const newLastSeen = (0, moment_1.default)().unix();
        await accountController_1.default.update(account, { lastSeen: newLastSeen });
        done(null, account, accessToken);
    }
    catch (error) {
        console.error({ error });
        done(error);
    }
}));
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'mail',
//       passwordField: 'password',
//       session: false,
//     },
//     async (mail, password, done) => {
//       try {
//         const account = await accountController.getByMail(mail);
//         const validPassword = await securityController
//           .compareHash(password, account.passwordHash)
//         if(!validPassword) throw new InvalidArgumentError('invalid password!!')
//         done(null, account);
//       } catch (error) {
//         console.error(error);
//         done({ name: "InvalidArgumentError", msg: "invalid mail" });
//       }
//     }
//   )
// );
