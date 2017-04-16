var express = require('express');
var router = express.Router();
var DispatchHandler = require('../handlers/dispatch');

module.exports = function () {
    var dispatchHandler = new DispatchHandler();

    router.post('/', dispatchHandler.send);

    return router;
};