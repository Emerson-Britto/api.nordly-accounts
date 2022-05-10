import { createClient, RedisClientOptions, RedisClientType } from 'redis';


class Redis {
  client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_ENDPOINT,
      password: process.env.REDIS_PASSWORD
    });
    this.client.on('error', (err:any) => console.error(err));
    this.client.connect();
  }

  connection() {
    return this.client;
  }
}

export default new Redis();
