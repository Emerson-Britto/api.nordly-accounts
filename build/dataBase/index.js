"use strict";
var Sequelize = require('sequelize');
var config = require('config');
var instance = new Sequelize(config.get('mysql.connectionString'));
module.exports = instance;
