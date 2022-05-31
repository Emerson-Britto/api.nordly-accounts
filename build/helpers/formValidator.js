"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountController_1 = __importDefault(require("../controllers/accountController"));
const formValidator = async (userData) => {
    const errors = [
        Object.keys(userData).length === 0,
        await accountController_1.default.getBy({ mail: userData.mail }),
        userData.username.length > 14 || userData.username.length < 4,
        userData.mail.length > 40 || userData.mail.length < 8
    ];
    return errors.some(test => test === true);
};
exports.default = formValidator;
