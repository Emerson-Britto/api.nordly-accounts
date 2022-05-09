const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const accountController = require('./accountController')
const securityController = require('./securityController')

const { InvalidArgumentError } = require('../../common/error');


passport.use(
    new LocalStrategy(
        {
            usernameField: 'mail',
            passwordField: 'password',
            session: false,
        },
        async (mail, password, done) => {
            try {
                const account = await accountController.getByMail(mail);
                const validPassword = await securityController
                    .compareHash(password, account.passwordHash)

                if(!validPassword) throw new InvalidArgumentError('invalid password!!')

                done(null, account);
            } catch (error) {
                console.error(error);
                done({ name: "InvalidArgumentError", msg: "invalid mail or password" });
            }
        }
    )
);

passport.use(
    new BearerStrategy(async (token, done) => {

        try {
            const { id } = await securityController.verifyAccessToken(token);
            const account = await accountController.getById(id);
            done(null, account, { token });
        } catch (error) {
            done(error);
        }
    })
);