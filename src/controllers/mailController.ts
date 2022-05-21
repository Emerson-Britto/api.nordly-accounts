import { VerificationMail } from '../mailer/verificationMail';
import securityController from './securityController';
import { LoginInfor } from '../common/interfaces';

class MailController {
  constructor() {}

  async sendVerificationMail(loginData:LoginInfor) {
    const code:string = await securityController.createToken(loginData.mail);
    const verificationMail = new VerificationMail(loginData, code);
    await verificationMail.sendMail().catch(console.warn);
  }
}

const mailController = new MailController();
export default mailController;
