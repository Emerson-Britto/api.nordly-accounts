"use strict";
var promisify = require('util').promisify;
var redis = require('redis');
var redisDB = redis.createClient('redis://redis-10374.c258.us-east-1-4.ec2.cloud.redislabs.com:10374', {
    password: 'hBm0TciZS8Rkg9hZavvn38yXpF0Qnrv5'
});
module.exports = {
    set: promisify(redisDB.set).bind(redisDB),
    exists: promisify(redisDB.exists).bind(redisDB),
    get: promisify(redisDB.get).bind(redisDB),
    del: promisify(redisDB.del).bind(redisDB),
    expiresAt: function (key, temp) { return (redisDB.expireat(key, temp)); },
};
