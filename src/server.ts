import dotenv from 'dotenv';
import httpServer from './app';
import './startup';
dotenv.config();

const DEV_ENV_PORT = process.env.DEV_ENV_PORT;
const PORT = process.env.PORT || DEV_ENV_PORT;

httpServer.listen(PORT, () => {
  console.log('Started: ' + new Date());
  if(DEV_ENV_PORT) console.log(`url: http://localhost:${PORT}/`);
});
