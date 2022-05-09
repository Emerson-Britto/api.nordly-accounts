import nodemailer from 'nodemailer';

const prodConfig = {
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL
  },
  secure: true
};

const devConfig = (testAccount) => ({
  host: 'smtp.ethereal.email',
  auth: testAccount,
});

async function setMailConfig() {
  if (!process.env.DEV_ENV) {
    return prodConfig;
  } else {
    const testAccount = await nodemailer.createTestAccount();
    return devConfig(testAccount);
  }
}

class Mail {
  async sendMail() {
    const mailConfig = await setMailConfig();
    const transport = nodemailer.createTransport(mailConfig);
    const info = await transport.sendMail(this);
  
    if (process.env.DEV_ENV) {
      console.log('URL: ' + nodemailer.getTestMessageUrl(info));
    }
  }
}

export default Mail;