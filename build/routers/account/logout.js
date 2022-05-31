"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const securityController_1 = __importDefault(require("../../controllers/securityController"));
const logout = async (req, res) => {
    const accessToken = req.headers.authorization;
    const { deviceId = "" } = req.query || {};
    if (!accessToken)
        return res.status(401).json({ msg: "invalid token!" });
    try {
        if (deviceId) {
            await securityController_1.default.revokeToken(`${deviceId}*`);
        }
        else {
            await securityController_1.default.revokeToken(accessToken);
        }
        ;
        res.status(201).send();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ err });
    }
};
exports.default = logout;
