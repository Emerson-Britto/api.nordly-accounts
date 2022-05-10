import { VerificationMail } from '../mailer/verificationMail';
import securityController from './securityController';

class MailController {
  constructor() {}

  async sendVerificationMail(mail:string) {
    const code:number = await securityController.createTempCode(mail);
    const verificationMail = new VerificationMail({ mail, code });
    await verificationMail.sendMail().catch(console.warn);
  }
}

const mailController = new MailController();
export default mailController;
