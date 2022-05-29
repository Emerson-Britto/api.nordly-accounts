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

  custom(req:Request, res:Response, next:NextFunction) {
    passport.authenticate('customStrategy', {}, (error, account, infor) => {
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

  bearer(req:Request, res:Response, next:NextFunction) {
    passport.authenticate('bearer', { session: false }, (error, account, accessToken, infor) => {
      if (error && error.name === 'InvalidArgumentError') {
        return res.status(401).json({ msg: error });
      }

      if (error && error.name === 'InvalidTokenError') {
        return res.status(410).json({ error });
      }

      if (error) {
        return res.status(500).json({ msg: error });
      }

      if(!accessToken) {
        return res.status(401).json({ msg: "invalid token!" })
      }

      if (!account) {
        return res.status(401).json({ msg: 'undefined account' });
      }

      req.body.account = account;
      req.headers.authorization = accessToken;
      return next();
    })(req, res, next);
  }
}

const authenticationMiddlewares = new AuthenticationMiddlewares();
export default authenticationMiddlewares;
