import nodemailer from 'nodemailer';
import { MailData } from '../common/interfaces';

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
  } else {
    return {
      host: 'smtp.ethereal.email',
      auth: await nodemailer.createTestAccount()
    };
  }
}

class Mail {
  data:MailData;

  constructor(data:MailData) {
    this.data = data;
  }

  async sendMail() {
    const mailConfig = await setMailConfig();
    const transport = nodemailer.createTransport(mailConfig);
    const info = await transport.sendMail(this.data);
  
    if (process.env.DEV_ENV) {
      console.log('URL: ' + nodemailer.getTestMessageUrl(info));
    }
  }
}

export default Mail;
