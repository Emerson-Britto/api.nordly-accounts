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


// const redisDB = async() => {
//   return new Promise(async(resolve, reject): Promise<RedisClientType> => {
//     const client:RedisClientType = createClient<RedisClientOptions>({
//       url: 'redis-16973.c256.us-east-1-2.ec2.cloud.redislabs.com:16973',
//       password: '1iXzcGhWUqSRnyvif0OTaJpDIJgGMYtt'
//     });

//     client.on('error', reject);

//     await client.connect();
//     resolve(client);
//   })
// }

// export default redisDB();


// import { createClient, RedisClientOptions, RedisClientType } from "redis";

// const factory = (options: RedisClientOptions<any, any>): RedisClientType => {
//   return createClient(options);
// };

// import { createClient } from "redis";
// type RedisClientType = ReturnType<typeof createClient>;
// type RedisClientOptions = Parameters<typeof createClient>[0];

// const factory = (options: RedisClientOptions): RedisClientType => {
//   return createClient(options);
// };

// const client: RedisClientType = factory({});