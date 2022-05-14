import { Request, Response } from 'express';
import accountController from '../../controllers/accountController';
import redis from '../../dataBases/redis';
import securityController from '../../controllers/securityController';
const redisDB = redis.connection();

interface AccountData {
  currentDevice?:any;
  account?: {
    displayName:string;
    mail:string;
    lastSeen:number;
  }
}

const accountData = async(req:Request, res:Response) => {
  const { token='', part='' } = req.query || {};
  const partList = String(part).split(',');
	const data:AccountData = {};

  const { uuidb }:any = await securityController.verifyAccessToken(String(token));

  if (partList.includes('currentDevice')) {
    const tokenData = await redisDB.get(String(token));
  	data['currentDevice'] = JSON.parse(tokenData || '');
  }

  if (partList.includes('account')) {
  	const account = await accountController.getById(uuidb);
  	data['account'] = account;
  }

  // if (partList.includes('devices')) {
  // 	data['devices'] = await accountController.listDevices({id: Number(uuidb)});
  // }

  res.status(200).json(data);
}

export default accountData;
