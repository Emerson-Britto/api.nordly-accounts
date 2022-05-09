import moment from 'moment';
import redis from '../../common/redis';
import securityController from './securityController';
import authorizedServices  from '../../common/authorizedServices';
import { urlEncoding } from '../../helpers';
import { InvalidService } from '../../common/error';

const createFastToken = async(req, res) => {
  try {
	const { accessToken, afterUrl } = req.query;

	const hasSomeAuthorization = authorizedServices
		.some(service => service.test(urlEncoding(afterUrl).decoder()));

	if (!hasSomeAuthorization) throw new InvalidService('invalid service!');

	await securityController.verifyAccessToken(accessToken);
	const key = faker.datatype.uuid() + '-tmpKey-' + faker.datatype.uuid();
	const expireat = moment().add(1, 'm').unix();
	await redis.set(key, accessToken);
	redis.expiresAt(key, expireat);

    res.status(200).send({ KEY: key });
  } catch(error) {
  	console.error(error);
  	res.status(401).json({ error });
  }
}

export default createFastToken;
