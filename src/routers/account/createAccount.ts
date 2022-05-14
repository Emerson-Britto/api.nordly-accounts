import { Request, Response } from 'express';
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
	if (hasError) {
		return res.status(401).json({ msg: 'account was denied' });
	};

	//delete newUser.rePassword;
	//newUser.passwordHash = await securityController.getHash(newUser.password);
	newUser.lastSeen = moment().subtract({ day: 14, hour: 22 }).unix();

	const dbUserData = await accountController.add(newUser);
	await mailController.sendVerificationMail(dbUserData.mail);

	res.status(201).send();
}

export default createAccount;
