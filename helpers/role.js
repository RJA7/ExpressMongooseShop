var logger = require('../libs/log')(module);

module.exports = function Role() {
    if (!(this instanceof Role)) {
        return new Role();
    }

    var error = {
        status: 401,
        message: 'No permission'
    };
    
    this.isAdmin = function (req, res, next) {
        if (req.user.role === 'ADMIN') {
            return next();
        }

        logger.warn('No permission request. Admin level ' + req.originalUrl);
        next(error);
    };

    this.isUser = function (req, res, next) {
        if ((req.user.role === 'USER' && req.user.status) || req.user.role === 'ADMIN') {
            return next();
        }

        logger.info('No permission request. User level ' + req.originalUrl);
        next(error);
    }
};