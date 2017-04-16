var express = require('express');
var router = express.Router();
var CartHandler = require('../handlers/carts');
var role = require('../helpers/role')();

module.exports = function () {
    var cartHandler = new CartHandler();
    
    router.post('/', cartHandler.addCart);
    router.get('/', role.isAdmin, cartHandler.getCarts);
    router.get('/:id', cartHandler.getCart);
    router.put('/:id', role.isAdmin, cartHandler.changeCart);
    router.delete('/:id', role.isAdmin, cartHandler.deleteCart);
    
    router.get('/:id/products', cartHandler.getCartProducts);

    return router;
};