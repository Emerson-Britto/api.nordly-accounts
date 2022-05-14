import { Server } from "socket.io";
import httpServer from './app';
import mailController from "./controllers/mailController";
const io = new Server(httpServer);

class Socket {
  sockets:any;

  constructor() {
    this.sockets = {};
    io.on('connection', (socket) => {
      console.log(`socket (${socket.id}) connected.`);
      this.sockets[socket.id] = socket;
      socket.on("disconnect", () => {
        delete this.sockets[socket.id];
        console.log(`socket (${socket.id}) disconnected.`);
      });
      // socket.on("checkMail", mail => {
      //   if (!mail || mail.length < 15) socket.emit("checkMail_error", { msg: "invalid mail!" });
      //   await mailController.sendVerificationMail(mail);
      //   this.sockets[socket.id] = socket;
      // })
    })
  }
}
