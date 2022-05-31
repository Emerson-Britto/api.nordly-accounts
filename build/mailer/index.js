"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const prodConfig = {
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
    },
    secure: true
};
async function setMailConfig() {
    if (!process.env.DEV_ENV) {
        return prodConfig;
    }
    else {
        return {
            host: 'smtp.ethereal.email',
            auth: await nodemailer_1.default.createTestAccount()
        };
    }
}
class Mail {
    constructor(data) {
        this.data = data;
    }
    async sendMail() {
        const mailConfig = await setMailConfig();
        const transport = nodemailer_1.default.createTransport(mailConfig);
        const info = await transport.sendMail(this.data);
        if (process.env.DEV_ENV) {
            console.log('URL: ' + nodemailer_1.default.getTestMessageUrl(info));
        }
    }
}
exports.default = Mail;
