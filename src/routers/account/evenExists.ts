import { Request, Response } from 'express';
import accountController from '../../controllers/accountController';

interface EvenExistsResponse {
	hasEvenUsername:boolean | null;
	hasEvenMail:boolean | null;
}

const evenExists = async(req:Request, res:Response) => {
	const { username=null, mail=null } = req.query || {};
	
	try {
		const hasEvenUsername = username ? Boolean(await accountController.getBy({ username })) : null;
		const hasEvenMail = mail ? Boolean(await accountController.getBy({ mail })) : null;
		res.status(200).json({ hasEvenUsername, hasEvenMail });
	} catch(err) {
		console.error(err);
		res.status(500).json({ msg: 'inexpected error' });
	}
};

export default evenExists;
