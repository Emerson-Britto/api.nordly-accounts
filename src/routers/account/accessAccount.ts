import { Request, Response } from 'express';
import moment from 'moment';
import accountController from './accountController';
import securityController from './securityController';
import mailController from '../../common/mailController';

const accessAccount = async(req:Request, res:Response) => {

	await accountController.dropOffAccounts();
	const account = req.account;
	const deviceData = req.body.deviceData;

	if(!account.verified) {
		await mailController.sendVerificationMail(account.mail);
		return res.status(428).json({ msg: 'account needs to be verified'});
	}

	const newDevices = await securityController.revokeInvalidDevices(account.devices);
	const newLastSeen = moment().unix();
	await accountController.update(account, { newDevices, newLastSeen });

	const accessToken = await securityController.createAccessToken(account, deviceData);

	res.status(200).send({ACCESS_TOKEN: accessToken});
}

export default accessAccount;
