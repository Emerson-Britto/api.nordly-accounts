"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountController_1 = __importDefault(require("../../controllers/accountController"));
const evenExists = async (req, res) => {
    const { username = null, mail = null } = req.query || {};
    try {
        const hasEvenUsername = username ? Boolean(await accountController_1.default.getBy({ username })) : null;
        const hasEvenMail = mail ? Boolean(await accountController_1.default.getBy({ mail })) : null;
        res.status(200).json({ hasEvenUsername, hasEvenMail });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'inexpected error' });
    }
};
exports.default = evenExists;
