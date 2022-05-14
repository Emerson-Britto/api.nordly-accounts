import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import accountController from '../../controllers/accountController';
import securityController from '../../controllers/securityController';
import { InvalidArgumentError } from '../../common/error';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'mail',
      //passwordField: 'password',
      session: false,
    },
    async (mail, password, done) => {
      try {
        const account = await accountController.getByMail(mail);
        // const validPassword = await securityController
        //     .compareHash(password, account.passwordHash)

        // if(!validPassword) throw new InvalidArgumentError('invalid password!!')

        done(null, account);
      } catch (error) {
        console.error(error);
        done({ name: "InvalidArgumentError", msg: "invalid mail" });
      }
    }
  )
);

passport.use(
  new BearerStrategy(async(token:string, done) => {
    try {
      const { id }:any = await securityController.verifyAccessToken(token);
      const account = await accountController.getById(id);
      done(null, account, token);
    } catch (error) {
      done(error);
    }
  })
);
