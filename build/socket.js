"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const securityController_1 = __importDefault(require("./controllers/securityController"));
class Socket {
    constructor() {
        this.sockets = [];
        this.ioInstance = null;
    }
    start(httpServer) {
        this.ioInstance = new socket_io_1.Server(httpServer);
        this.ioInstance.on('connection', (socket) => {
            console.log(`socket (${socket.id}) connected.`);
            socket.on("checkMail", async ({ mail, socketCode }, callback) => {
                const invalidMail = !mail || mail.length < 11;
                if (invalidMail)
                    return callback({ error: true, status: 401, msg: "invalid mail!" });
                const isValid = await securityController_1.default.isValidToken(mail, socketCode, "socket_code");
                if (!isValid || !socketCode)
                    return callback({ error: true, status: 401, msg: "invalid SOCKET_CODE!" });
                socket.data.code = socketCode;
                socket.data.mail = mail;
                this.sockets.push(socket);
            });
            socket.on("disconnect", () => {
                this.sockets = this.sockets.filter(s => s.id != socket.id);
                console.log(`socket (${socket.id}) disconnected with (${socket.data.mail}).`);
            });
        });
    }
    connection(property) {
        const [key, value] = property.split(':');
        const socket = this.sockets.find(s => s.data[key] === value);
        return socket;
    }
}
const socket = new Socket();
exports.default = socket;
