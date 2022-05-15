import { Request, Response } from 'express';
import cache from "memory-cache";
import moment from 'moment';
import { formValidator } from '../../helpers';
import accountController from '../../controllers/accountController';
import securityController from '../../controllers/securityController';
import mailController from '../../controllers/mailController';

(async() => {
	console.log(await accountController.getList());
})()


const createAccount = async (req:Request, res:Response) => {
	await accountController.dropOffAccounts();

	const { newUser, deviceData=null } = req.body;

	const hasError = await formValidator(newUser);
	const invalidDevice = !deviceData || !deviceData.localInfor.YourFuckingIPAddress || !deviceData.platform;

	if (hasError) return res.status(401).json({ msg: 'account was denied' });
	if (invalidDevice) return res.status(401).json({ msg: 'Unknown Device Data'})

	//delete newUser.rePassword;
	//newUser.passwordHash = await securityController.getHash(newUser.password);
	try {
		newUser.lastSeen = moment().unix();
		newUser.verified = 0;
		const dbUserData = await accountController.add(newUser);

		const loginData = {
			status: "requesting Sign-Up authorization",
			mail: dbUserData.mail,
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
		cache.put(dbUserData.mail, loginData, 5 * 60000); // 5 minutes.
		res.status(200).json({ socketCode });
	} catch(err) {
		res.status(401).json({ msg: err });
	}
}

export default createAccount;

// interface deviceData {
//   userAgent:string;
//   platform:string;
//   app: {
//     appName:string;
//     appCodeName:string;
//     appVersion:string;
//     language:string;
//     doNotTrack:string;
//     cookieEnabled:string;
//   };
//   localInfor:any;
// }