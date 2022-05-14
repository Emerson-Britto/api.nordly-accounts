import { Request, Response } from 'express';
import moment from 'moment';
import accountController from '../../controllers/accountController';
import securityController from '../../controllers/securityController';
import mailController from '../../controllers/mailController';
import { DBAccount } from '../../common/interfaces';

const accessAccount = async(req:Request, res:Response) => {

	await accountController.dropOffAccounts();
	const account = req.body.account;
	const deviceData = req.body.deviceData;

	// if(!account.verified) {
	// 	await mailController.sendVerificationMail(account.mail);
	// 	return res.status(428).json({ msg: 'account needs to be verified'});
	// }

	const newLastSeen = moment().unix();
	await accountController.update(account, { lastSeen: newLastSeen });

	const accessToken = await securityController.createAccessToken(account, deviceData);
	res.status(200).send({ ACCESS_TOKEN: accessToken });
}

export default accessAccount;
