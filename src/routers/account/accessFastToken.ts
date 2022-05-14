import { Request, Response } from 'express';
import redis from '../../dataBases/redis';
import { InvalidArgumentError } from '../../common/error';
const redisDB = redis.connection();

const createFastToken = async(req:Request, res:Response) => {
  try {
		const { passToken='' } = req.query || {};

		if (passToken && await redisDB.exists(String(passToken))) {
			const accessToken = await redisDB.get(String(passToken));
			res.status(200).send({ ACCESS_TOKEN: accessToken });
		} else {
			throw new InvalidArgumentError('invalid passToken!')
		}

  } catch(error) {
  	console.error(error);
  	res.status(401).json({ error });
  }
}

export default createFastToken;
