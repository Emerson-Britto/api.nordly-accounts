import { createClient, RedisClientType } from 'redis';

export default const redisDB = async(): Promise<RedisClientType> => {
  return new Promise(async(resolve, reject) => {
    const client = createClient('redis://redis-10374.c258.us-east-1-4.ec2.cloud.redislabs.com:10374', {
      password: 'hBm0TciZS8Rkg9hZavvn38yXpF0Qnrv5'
    });

    client.on('error', reject);

    await client.connect();
    resolve(client);
  })
}
