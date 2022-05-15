import { VerificationMail } from '../mailer/verificationMail';
import securityController from './securityController';
import { LoginInfor } from '../common/interfaces';

class MailController {
  constructor() {}

  async sendVerificationMail(loginData:LoginInfor) {
    const code:string = await securityController.createTempCode(loginData.mail);
    const socketCode:string = await securityController.createTempCode(loginData.mail, "socket_code");
    const verificationMail = new VerificationMail(loginData, code);
    await verificationMail.sendMail().catch(console.warn);
    return socketCode;
  }
}

const mailController = new MailController();
export default mailController;
