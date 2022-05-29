import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { createServer } from "http";
import accountRouter from './routers/account';
import authorizationRouter from './routers/accessAuthorization';
import redis from './dataBases/redis';
const app = express();

// (async() => {
//   const redisDB = redis.connection();
//   const result = await redisDB.sendCommand(['SCAN', '0', 'MATCH', '*::eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9*', 'COUNT', '10000']);
//   // const result = await redisDB.get('*::dfdsfdgdgdgdf')
//   console.log({ result });

//   // scan 0 MATCH emer*******7@gmail.com::* COUNT 10000
// })()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req:Request, res:Response, next:NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  console.log(`
    ----------------------------
    NEW REQUEST: ${req.url};
    DATE: ${new Date()};
    ----------------------------
  `);
  next();
})

app.get('/', (req:Request, res:Response) => {
  res.json({
    title: '!nfinity-API',
    author: 'Emerson-Britto',
    description: "account manager api"
  })
})

app.use('/account', accountRouter)
app.use('/authorization', authorizationRouter)

const httpServer = createServer(app)
export default httpServer;
