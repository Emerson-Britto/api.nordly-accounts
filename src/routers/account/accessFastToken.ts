import { Request, Response } from 'express';
import redis from '../../dataBases/redis';
import { InvalidArgumentError } from '../../common/error';
const redisDB = redis.connection();


// TEMP
const accessFastToken = async(req:Request, res:Response) => {
  try {
 		const { passToken='' } = req.query || {};
		const isActiveToken = await redisDB.exists(`${passToken}`);
		if (!passToken || !isActiveToken) throw new InvalidArgumentError('invalid passToken!')

		const accessToken = await redisDB.get(`${passToken}`);
		res.status(200).send({ accessToken });
  } catch(error) {
  	console.error(error);
  	res.status(401).json({ error });
  }
}

export default accessFastToken;
