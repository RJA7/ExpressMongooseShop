var express = require('express');
var router = express.Router();
var AdminHandler = require('../handlers/admins');
var multiparty = require('connect-multiparty')();

module.exports = function () {
    var adminHandler = new AdminHandler();

    router.post('/', multiparty, adminHandler.addAdmin);
    router.get('/', adminHandler.getAdmins);
    router.get('/:id', adminHandler.getAdmin);
    router.put('/:id', multiparty, adminHandler.changeAdmin);
    router.delete('/:id', adminHandler.deleteAdmin);

    return router;
};
