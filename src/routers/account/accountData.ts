import { Request, Response } from 'express';
import accountController from '../../controllers/accountController';
import redis from '../../dataBases/redis';
import securityController from '../../controllers/securityController';
const redisDB = redis.connection();

interface AccountData {
  currentDevice?:any;
  account?: {
    username:string;
    mail:string;
    lastSeen:number;
  }
  devices?: any[];
}

const accountData = async(req:Request, res:Response) => {
  const accessToken = req.headers.authorization;
  const { part='' } = req.query || {};
  const partList = String(part).split(',');
	const data:AccountData = {};

  try {
    const { uuidb }:any = await securityController.verifyAccessToken(String(accessToken));
    const account = await accountController.getById(uuidb);

    if (partList.includes('currentDevice')) {
      const tokenData = await redisDB.get(`${account.mail}::${accessToken}`);
      data['currentDevice'] = JSON.parse(tokenData || '');
    }

    if (partList.includes('account')) {
      data['account'] = account;
    }

    if (partList.includes('devices')) {
      data['devices'] = await securityController.allTokensData({
        includeThis: accessToken,
        account
      });
    }

    res.status(200).json(data);
  } catch(err) {
    console.error(err);
    res.status(401).json({ msg: 'invalid token or token provide expired data' });
  }
}

export default accountData;
