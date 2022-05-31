"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = require("http");
const account_1 = __importDefault(require("./routers/account"));
const accessAuthorization_1 = __importDefault(require("./routers/accessAuthorization"));
const app = (0, express_1.default)();
// (async() => {
//   const redisDB = redis.connection();
//   const result = await redisDB.sendCommand(['SCAN', '0', 'MATCH', '*::eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9*', 'COUNT', '10000']);
//   // const result = await redisDB.get('*::dfdsfdgdgdgdf')
//   console.log({ result });
//   // scan 0 MATCH emer*******7@gmail.com::* COUNT 10000
// })()
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    console.log(`
    ----------------------------
    NEW REQUEST: ${req.url};
    DATE: ${new Date()};
    ----------------------------
  `);
    next();
});
app.get('/', (req, res) => {
    res.json({
        title: '!nfinity-API',
        author: 'Emerson-Britto',
        description: "account manager api"
    });
});
app.use('/account', account_1.default);
app.use('/authorization', accessAuthorization_1.default);
const httpServer = (0, http_1.createServer)(app);
exports.default = httpServer;
