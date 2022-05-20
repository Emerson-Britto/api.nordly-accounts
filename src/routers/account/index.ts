import express, { Request, Response } from 'express';
import createAccount from './createAccount';
import accessAccount from './accessAccount';
import createFastToken from './createFastToken';
import accessFastToken from './accessFastToken';
import accountData from './accountData';
import evenExists from './evenExists';
import authenticatonMiddlewares from './authenticationMiddlewares';

const router = express.Router();

router.options('/', (req:Request, res:Response) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200);
    res.end();
})

router
    .route('/')
    .get(accountData)

router
    .route('/exists')
    .get(evenExists)

router
    .route('/createFastToken')
    .get(createFastToken)

router
    .route('/accessFastToken')
    .get(accessFastToken)

router
    .route('/create')
    .post(createAccount)

router
    .route('/login')
    .post(authenticatonMiddlewares.local, accessAccount)


export default router;
