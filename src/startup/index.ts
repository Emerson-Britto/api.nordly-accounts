import accountController from '../controllers/accountController';
import '../dataBases/mySql/createTables';
import '../routers/account/authenticationStrategy';

(async()=> {
	if (process.env.DROP_ALL_ACCOUNTS_FROM_DB == 1) {
		await accountController.dropOffAccounts({ force: true });
	}	
})()
