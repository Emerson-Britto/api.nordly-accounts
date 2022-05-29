import { Request, Response } from 'express';
import securityController from '../../controllers/securityController';

const logout = async(req:Request, res:Response) => {
	const accessToken = req.headers.authorization;
	const { deviceId="" } = req.query || {};
	
	if (!accessToken) return res.status(401).json({ msg: "invalid token!" });

	try {
		if (deviceId) { await securityController.revokeToken(`${deviceId}*`) }
		else { await securityController.revokeToken(accessToken) };
		res.status(201).send();
	} catch(err) {
		console.error(err);
		res.status(401).json({ err });
	}
};

export default logout;
