"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mySql_1 = __importDefault(require("../dataBases/mySql"));
const sequelize_1 = require("sequelize");
class AccountModel extends sequelize_1.Model {
}
AccountModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: new sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    mail: {
        type: new sequelize_1.DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    lastSeen: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    verified: {
        type: new sequelize_1.DataTypes.STRING(1),
        allowNull: false
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: 'accounts',
    sequelize: mySql_1.default
});
exports.default = AccountModel;
