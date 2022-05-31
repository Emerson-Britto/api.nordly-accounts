"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verificationMail_1 = require("../mailer/verificationMail");
const securityController_1 = __importDefault(require("./securityController"));
class MailController {
    constructor() { }
    async sendVerificationMail(loginData) {
        const code = await securityController_1.default.createToken(loginData.mail);
        const verificationMail = new verificationMail_1.VerificationMail(loginData, code);
        await verificationMail.sendMail().catch(console.warn);
    }
}
const mailController = new MailController();
exports.default = mailController;
