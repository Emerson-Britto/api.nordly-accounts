"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
class AuthenticationMiddlewares {
    local(req, res, next) {
        passport_1.default.authenticate('local', { session: false }, (error, account, infor) => {
            if (error && error.name === 'InvalidArgumentError') {
                return res.status(401).json({ error });
            }
            if (error) {
                return res.status(500).json({ error });
            }
            if (!account) {
                return res.status(401).json({ error: 'undefined account' });
            }
            req.body.account = account;
            return next();
        })(req, res, next);
    }
    custom(req, res, next) {
        passport_1.default.authenticate('customStrategy', {}, (error, account, infor) => {
            if (error && error.name === 'InvalidArgumentError') {
                return res.status(401).json({ error });
            }
            if (error) {
                return res.status(500).json({ error });
            }
            if (!account) {
                return res.status(401).json({ error: 'undefined account' });
            }
            req.body.account = account;
            return next();
        })(req, res, next);
    }
    bearer(req, res, next) {
        passport_1.default.authenticate('bearer', { session: false }, (error, account, accessToken, infor) => {
            if (error && error.name === 'InvalidArgumentError') {
                return res.status(401).json({ msg: error });
            }
            if (error && error.name === 'InvalidTokenError') {
                return res.status(410).json({ error });
            }
            if (error) {
                return res.status(500).json({ msg: error });
            }
            if (!accessToken) {
                return res.status(401).json({ msg: "invalid token!" });
            }
            if (!account) {
                return res.status(401).json({ msg: 'undefined account' });
            }
            req.body.account = account;
            req.headers.authorization = accessToken;
            return next();
        })(req, res, next);
    }
}
const authenticationMiddlewares = new AuthenticationMiddlewares();
exports.default = authenticationMiddlewares;
