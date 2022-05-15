import { Request, Response } from 'express';
import cache from "memory-cache";
import moment from 'moment';
import accountController from '../../controllers/accountController';
import securityController from '../../controllers/securityController';
import mailController from '../../controllers/mailController';
import { DBAccount } from '../../common/interfaces';

const accessAccount = async(req:Request, res:Response) => {

	await accountController.dropOffAccounts();
	const account = req.body.account;
	const deviceData = req.body.deviceData;

	const loginData = {
		status: "requesting Sign-In authorization",
		mail: account.mail,
		ip: deviceData.localInfor.YourFuckingIPAddress,
		date: moment().format('LL'),
		time: moment().format('LTS'),
		location: deviceData.localInfor.YourFuckingLocation,
		ISP: deviceData.localInfor.YourFuckingISP,
		hostname: deviceData.localInfor.YourFuckingHostname,
		countryCode: deviceData.localInfor.YourFuckingCountryCode,
		os: deviceData.platform,
		userAgent: deviceData.userAgent
	}

	const socketCode = await mailController.sendVerificationMail(loginData);
	cache.put(account.mail, loginData, 5 * 60000); // 5 minutes.
	res.status(200).json({ socketCode });
}

export default accessAccount;
