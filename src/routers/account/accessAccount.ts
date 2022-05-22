import { Request, Response } from 'express';
import cache from "memory-cache";
import moment from 'moment';
import accountController from '../../controllers/accountController';
import securityController from '../../controllers/securityController';
import mailController from '../../controllers/mailController';
import { DBAccount } from '../../common/interfaces';

const accessAccount = async(req:Request, res:Response) => {
	const account = req.body.account;
	const deviceData = req.body.deviceData;

	const loginData = {
		status: "from Sign-In",
		mail: account.mail,
		ip: deviceData.locationData.YourFuckingIPAddress,
		date: moment().format('LL'),
		time: moment().format('LTS'),
		location: deviceData.locationData.YourFuckingLocation,
		ISP: deviceData.locationData.YourFuckingISP,
		hostname: deviceData.locationData.YourFuckingHostname,
		countryCode: deviceData.locationData.YourFuckingCountryCode,
		os: deviceData.platform,
		userAgent: deviceData.userAgent
	}

	await mailController.sendVerificationMail(loginData);
	const socketCode:string = await securityController.createToken(loginData.mail, "socket_code");
	cache.put(account.mail, loginData, 5 * 60000); // 5 minutes.
	res.status(200).json({ socketCode });
}

export default accessAccount;
