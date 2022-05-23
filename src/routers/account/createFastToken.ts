import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import redis from '../../dataBases/redis';
import securityController from '../../controllers/securityController';
import authorizedServices  from '../../common/authorizedServices';
import { urlEncoding } from '../../helpers';
import { InvalidService } from '../../common/error';
const redisDB = redis.connection();

const createFastToken = async(req:Request, res:Response) => {
  try {
  	const accessToken = req.headers.authorization;
		const { afterUrl='' } = req.query || {};
		if (!accessToken || !afterUrl) return res.status(401).send();

		const hasSomeAuthorization = authorizedServices
			.some(service => service.test(urlEncoding(String(afterUrl)).decoder()));

		if (!hasSomeAuthorization) throw new InvalidService('service unauthorized!');

		await securityController.verifyAccessToken(String(accessToken));
		const key = 'tmpKey-' + uuidv4();
		const expireat = moment().add(1, 'm').unix();
		await redisDB.set(key, String(accessToken));
		redisDB.expireAt(key, expireat);

    res.status(200).send({ KEY: key });
  } catch(error) {
  	console.error(error);
  	res.status(401).json({ error });
  }
}

export default createFastToken;
