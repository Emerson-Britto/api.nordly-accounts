import { Request, Response } from 'express';
import accountController from './accountController';
import redis from '../../dataBases/redis';
import securityController from './securityController';

const accountData = async(req:Request, res:Response) => {
	const token = req.query['accessToken'];
	const part = req.query['part'];

	let data = {};

	const partList = part.split(',');

  const { uiidb } = await securityController.verifyAccessToken(token);

  if (partList.includes('currentDevice')) {
  	data['currentDevice'] = JSON.parse(await redis.get(token));
  }

  if (partList.includes('account')) {
  	const account = await accountController.getById(Number(uiidb));
  	data['account'] = account;
  }

  // if (partList.includes('devices')) {
  // 	data['devices'] = await accountController.listDevices({id: Number(uiidb)});
  // }

  res.status(200).json(data);
}

export default accountData;
