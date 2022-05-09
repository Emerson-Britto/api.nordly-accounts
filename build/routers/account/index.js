"use strict";
var router = require('express').Router();
var passport = require('passport');
var dataAlreadyExists = require('./dataAlreadyExists');
var createAccount = require('./createAccount');
var accessAccount = require('./accessAccount');
var verifyMail = require('./verifyMail');
var createFastToken = require('./createFastToken');
var accessFastToken = require('./accessFastToken');
var accountData = require('./accountData');
authenticatonMiddlewares = require('./authenticationMiddlewares');
router.options('/', function (req, res) {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200);
    res.end();
});
router
    .route('/')
    .get(accountData);
router
    .route('/exists')
    .get(dataAlreadyExists);
router
    .route('/verifyMail')
    .get(verifyMail);
router
    .route('/createFastToken')
    .get(createFastToken);
router
    .route('/accessFastToken')
    .get(accessFastToken);
router
    .route('/create')
    .post(createAccount);
router
    .route('/login')
    .post(authenticatonMiddlewares.local, accessAccount);
module.exports = router;
