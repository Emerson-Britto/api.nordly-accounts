import * as models from '../../models';
import accountController from '../../controllers/accountController';

(async() => {
  console.log('CREATING TABLE');
  for (let [modelName, modelRef] of Object.entries(models)) {
    await modelRef.sync({ force: false });
  }
  accountController.dropInactiveAccounts();
})()
