var express = require('express');
var router = express.Router();
var LoginHandler = require('../handlers/login');

module.exports = function () {
    var loginHandler = new LoginHandler();

    router.use(loginHandler.fillUser);
    
    router.post('/register', loginHandler.register);
    router.post('/login', loginHandler.login);
    router.get('/logout', loginHandler.logout);
    router.post('/forgot', loginHandler.forgot);
    
    return router;
};
