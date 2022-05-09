import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
const app = express();

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

const accountRouter = require('./routers/account')
app.use('/account', accountRouter)

const filesRouter = require('./routers/files')
app.use('/files', filesRouter)


export default app;
