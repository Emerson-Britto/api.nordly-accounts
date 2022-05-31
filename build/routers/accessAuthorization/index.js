"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const memory_cache_1 = __importDefault(require("memory-cache"));
const securityController_1 = __importDefault(require("../../controllers/securityController"));
const accountController_1 = __importDefault(require("../../controllers/accountController"));
const socket_1 = __importDefault(require("../../socket"));
const router = express_1.default.Router();
router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200);
    res.end();
});
router.get("/:code", async (req, res) => {
    const { mail, authorized = null } = req.query || {};
    const { code = null } = req.params || {};
    try {
        if (!mail || !authorized || !code)
            return res.status(401).send();
        const isValid = await securityController_1.default.isValidToken(String(mail), code, "temp_token");
        if (!isValid)
            return res.status(401).send();
        const socket = socket_1.default.connection(`mail:${mail}`);
        if (authorized == "deny") {
            socket.emit("unauthorized", { accessToken: null });
            memory_cache_1.default.del(mail);
            return res.sendFile(node_path_1.default.join(__dirname, './unauthorized.html'));
        }
        else if (authorized == 'allow') {
            const account = await accountController_1.default.getByMail(String(mail));
            const newLastSeen = (0, moment_1.default)().unix();
            await accountController_1.default.update(account, { lastSeen: newLastSeen, verified: 1 });
            const deviceData = memory_cache_1.default.get(account.mail);
            if (!deviceData)
                return res.status(500).json({ msg: "internal error, try login again" });
            const accessToken = await securityController_1.default.createAccessToken(account, deviceData);
            res.sendFile(node_path_1.default.join(__dirname, './authorized.html'));
            socket.emit("authorized", { accessToken });
            memory_cache_1.default.del(account.mail);
        }
        else {
            res.status(401).send();
        }
    }
    catch (err) {
        res.status(500).json({ msg: err });
    }
});
exports.default = router;
