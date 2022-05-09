"use strict";
var Sequelize = require('sequelize');
var instance = require('../../dataBase');
var columns = {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthDate: {
        type: Sequelize.STRING,
        allowNull: false
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastSeen: {
        type: Sequelize.STRING,
        allowNull: false
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    devices: {
        type: Sequelize.JSON,
        allowNull: false
    }
};
var options = {
    freezeTableName: true,
    tableName: 'accounts',
    timestamps: true,
};
module.exports = instance.define('account', columns, options);
