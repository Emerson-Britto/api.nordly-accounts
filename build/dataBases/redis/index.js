"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class Redis {
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: process.env.REDIS_ENDPOINT,
            password: process.env.REDIS_PASSWORD
        });
        this.client.on('error', (err) => console.error({ err }));
        this.client.connect();
    }
    connection() {
        return this.client;
    }
}
exports.default = new Redis();
