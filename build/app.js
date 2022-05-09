"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');
require('dotenv').config();
require('./onStartup');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    console.log("\n        ----------------------------\n        NEW REQUEST: ".concat(req.url, ";\n        DATE: ").concat(new Date(), ";\n        ----------------------------\n    "));
    next();
});
app.get('/', function (req, res) {
    res.json({
        title: '!nfinity-API',
        author: 'Emerson-Britto',
        description: "account manager api"
    });
});
var accountRouter = require('./routers/account');
app.use('/account', accountRouter);
var filesRouter = require('./routers/files');
app.use('/files', filesRouter);
module.exports = app;
