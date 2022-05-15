import { Server } from "socket.io";
import httpServer from './app';
import mailController from "./controllers/mailController";
import securityController from './controllers/securityController';
const io = new Server(httpServer);

class Socket {
  sockets:any[];

  constructor() {
    this.sockets = [];
    io.on('connection', socket => {
      console.log(`socket (${socket.id}) connected.`);
      socket.on("checkMail", async({ mail, socketCode }, callback) => {
        const invalidMail = !mail || mail.length < 15 || !socketCode;
        if (invalidMail) return callback({ error: true, status: 401, msg: "invalid mail!" });
        const isValid = await securityController.isValidTempCode(mail, socketCode, "socket_code");
        if (!isValid) return callback({ error: true, status: 401, msg: "invalid SOCKET_CODE!" });

        socket.code = socketCode;
        socket.mail = mail;
        this.sockets.push(socket);
      });
      socket.on("disconnect", () => {
        this.sockets = this.sockets.filter(s => s.id != socket.id);
        console.log(`socket (${socket.id}) disconnected with (${socket.mail}).`);
      });
    })
  }

  connection(property:string) {
    const [ key, value ] = property.split(':');
    const socket = this.sockets.find(s => s[key] === value);
    return socket;
  }
}

const socket = new Socket();
export default socket;
