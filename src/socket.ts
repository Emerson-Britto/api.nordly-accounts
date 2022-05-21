import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import mailController from "./controllers/mailController";
import securityController from './controllers/securityController';

interface Identification {
  mail:string;
  socketCode:string;
}

class Socket {
  sockets:any[];
  ioInstance:any;

  constructor() {
    this.sockets = [];
    this.ioInstance = null;
  }

  start(httpServer:any) {
    this.ioInstance = new Server(httpServer);
    this.ioInstance.on('connection', (socket:any) => {
      console.log(`socket (${socket.id}) connected.`);
      socket.on("checkMail", async({ mail, socketCode }:Identification, callback:(s:any) => void) => {
        const invalidMail = !mail || mail.length < 11;
        if (invalidMail) return callback({ error: true, status: 401, msg: "invalid mail!" });
        const isValid = await securityController.isValidToken(mail, socketCode, "socket_code");
        if (!isValid || !socketCode) return callback({ error: true, status: 401, msg: "invalid SOCKET_CODE!" });

        socket.data.code = socketCode;
        socket.data.mail = mail;
        this.sockets.push(socket);
      });
      socket.on("disconnect", () => {
        this.sockets = this.sockets.filter(s => s.id != socket.id);
        console.log(`socket (${socket.id}) disconnected with (${socket.data.mail}).`);
      });
    })
  }

  connection(property:string) {
    const [ key, value ] = property.split(':');
    const socket = this.sockets.find(s => s.data[key] === value);
    return socket;
  }
}

const socket = new Socket();
export default socket;
