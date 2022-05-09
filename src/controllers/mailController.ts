import { VerificationMail } from '../mailer/verificationMail';
import securityController from './securityController';

class MailController {
    constructor() {}

    async sendVerificationMail(mail) {
        let code = await securityController.createTempCode(mail);
        const verificationMail = new VerificationMail({ mail, code });
        await verificationMail.sendMail().catch(console.warn);
    },
}

const mailController = new MailController();
export default mailController;
