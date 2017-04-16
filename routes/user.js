var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/users');
var multiparty = require('connect-multiparty')();
var role = require('../helpers/role')();

module.exports = function () {
    var userHandler = new UserHandler();
    
    router.post('/', multiparty, userHandler.addUser);
    router.get('/', role.isAdmin, userHandler.getUsers);
    router.get('/:id', userHandler.getUser);
    router.put('/:id', multiparty, userHandler.changeUser);
    router.delete('/:id', userHandler.deleteUser);
    
    router.get('/:id/carts', userHandler.getUserCarts);
    router.get('/:id/comments', userHandler.getUserComments);

    return router;
};
