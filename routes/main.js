var express = require('express');
var router = express.Router();
var MainHandler = require('../handlers/main');

module.exports = function () {
    var mainHandler = new MainHandler();
    
    router.get('/', mainHandler.getPage);

    return router;
};
