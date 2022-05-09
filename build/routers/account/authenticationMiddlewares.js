"use strict";
var passport = require('passport');
var InvalidArgumentError = require('../../common/error').InvalidArgumentError;
module.exports = {
    local: function (req, res, next) {
        passport.authenticate('local', { session: false }, function (error, account, infor) {
            if (error && error.name === 'InvalidArgumentError') {
                return res.status(401).json({ error: error });
            }
            if (error) {
                return res.status(500).json({ error: error });
            }
            if (!account) {
                return res.status(401).json({ error: 'undefined account' });
            }
            req.account = account;
            return next();
        })(req, res, next);
    }
};
