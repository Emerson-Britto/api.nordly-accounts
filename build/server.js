"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const socket_1 = __importDefault(require("./socket"));
require("./startup");
dotenv_1.default.config();
socket_1.default.start(app_1.default);
const DEV_ENV_PORT = process.env.DEV_ENV_PORT;
const PORT = process.env.PORT || DEV_ENV_PORT;
app_1.default.listen(PORT, () => {
    console.log('Started: ' + new Date());
    if (DEV_ENV_PORT)
        console.log(`url: http://localhost:${PORT}/`);
});
