import { Request } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as CustomStrategy } from 'passport-custom';
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

passport.use('customStrategy', new CustomStrategy(async(req:Request, done) => {
    const { username=null, mail=null } = req.body?.user || {};
    const invalidForm = !username || !mail;

    try {
      if (invalidForm) throw new InvalidArgumentError('invalid form!');
      const account = await accountController.getByMail(mail);
      if (account.username != username) {
        throw new InvalidArgumentError('invalid username!!');
      }

      done(null, account);
    } catch (err) {
      console.error(err);
      done({ name: "InvalidArgumentError", msg: "invalid username and mail!" });
    }
  })
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
