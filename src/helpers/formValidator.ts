import { UserData } from '../common/interfaces';
import accountController from '../controllers/accountController';

const formValidator = async(userData:UserData): Promise<boolean> => {
	const errors = [
		Object.keys(userData).length === 0,
		await accountController.getBy({ mail: userData.mail }),
		userData.username.length > 14 || userData.username.length < 4,
		userData.mail.length > 40 || userData.mail.length < 8
	]

  return errors.some(test => test === true);
}

export default formValidator;
