"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createAccount_1 = __importDefault(require("./createAccount"));
const accessAccount_1 = __importDefault(require("./accessAccount"));
const createFastToken_1 = __importDefault(require("./createFastToken"));
const accessFastToken_1 = __importDefault(require("./accessFastToken"));
const accountData_1 = __importDefault(require("./accountData"));
const evenExists_1 = __importDefault(require("./evenExists"));
const logout_1 = __importDefault(require("./logout"));
const authenticationMiddlewares_1 = __importDefault(require("./authenticationMiddlewares"));
const router = express_1.default.Router();
router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200);
    res.end();
});
router
    .route('/')
    .get(authenticationMiddlewares_1.default.bearer, accountData_1.default);
router
    .route('/exists')
    .get(evenExists_1.default);
router
    .route('/createFastToken')
    .get(authenticationMiddlewares_1.default.bearer, createFastToken_1.default);
router
    .route('/accessFastToken')
    .get(accessFastToken_1.default);
router
    .route('/create')
    .post(createAccount_1.default);
router
    .route('/login')
    .post(authenticationMiddlewares_1.default.custom, accessAccount_1.default);
router
    .route('/logout')
    .get(authenticationMiddlewares_1.default.bearer, logout_1.default);
exports.default = router;
