import path from 'node:path';
import express, { Request, Response } from 'express';
import moment from 'moment';
import cache from "memory-cache";
import { urlEncoding } from '../../helpers';
import securityController from '../../controllers/securityController';
import accountController from '../../controllers/accountController';
import io from '../../socket';
const router = express.Router();

router.options('/', (req:Request, res:Response) => {
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200);
  res.end();
})

router.get("/:code", async(req:Request, res:Response) => {
  const { mail, authorized=null } = req.query || {};
  const { code=null } = req.params || {};

  try {
    if (!mail || !authorized || !code) return res.status(401).send();
    const isValid = await securityController.isValidTempCode(String(mail), code, "temp_code");
    if (!isValid) return res.status(401).send();
    const socket = io.connection(`mail:${mail}`);

    if (authorized == "deny") {
      socket.emit("unauthorized", { accessToken: null });
      cache.del(mail);
      return res.sendFile(path.join(__dirname, './unauthorized.html'));
    } else if (authorized == 'allow') {
      const account = await accountController.getByMail(String(mail));
      const newLastSeen = moment().unix();
      await accountController.update(account, { lastSeen: newLastSeen, verified: 1 });
      const deviceData = cache.get(account.mail);
      if (!deviceData) return res.status(500).json({ msg: "internal error, try login again" });

      const accessToken = await securityController.createAccessToken(account, deviceData);
      res.sendFile(path.join(__dirname, './authorized.html'));
      socket.emit("authorized", { accessToken });
      cache.del(account.mail);
    } else {
      res.status(401).send();
    }    
  } catch(err) {
    res.status(500).json({ msg: err });
  }

});

export default router;
