import accountController from '../controllers/accountController';
import '../dataBases/mySql/createTables';
import '../routers/account/authenticationStrategy';

(async()=> {
	const dropAllAccount:number = Number(process.env.DROP_ALL_ACCOUNTS_FROM_DB || 0);
	if (dropAllAccount === 1) {
		await accountController.dropOffAccounts({ force: true });
	}	
})()
