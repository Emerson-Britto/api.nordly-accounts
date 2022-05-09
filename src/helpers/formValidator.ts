import { UserData } from '../common/interfaces'; 

const formValidator = (userData:UserData): boolean => {
	const errors = [
		Object.keys(userData).length === 0,
		userData.displayName.length > 14 || userData.displayName.length < 4,
		userData.mail.length > 40 || userData.mail.length < 8
	]

  return errors.some(test => test === true);
}

export default formValidator;
