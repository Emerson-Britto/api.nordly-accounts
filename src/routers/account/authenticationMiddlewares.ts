import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { InvalidArgumentError } from '../../common/error';

class AuthenticationMiddlewares {
	local(req:Request, res:Response, next:NextFunction) {
		passport.authenticate('local', { session: false }, (error, account, infor) => {
			if (error && error.name === 'InvalidArgumentError') {
        return res.status(401).json({ error });
      }

      if (error) {
        return res.status(500).json({ error });
      }

      if (!account) {
        return res.status(401).json({error: 'undefined account'});
      }

      req.body.account = account;
    	return next();
		})(req, res, next);
	}
}

const authenticationMiddlewares = new AuthenticationMiddlewares();
export default authenticationMiddlewares;