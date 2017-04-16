var express = require('express');
var router = express.Router();
var ProductHandler = require('../handlers/products');
var multiparty = require('connect-multiparty')();
var role = require('../helpers/role')();

module.exports = function () {
    var productHandler = new ProductHandler();
    
    router.post('/', role.isAdmin, multiparty, productHandler.addProduct);
    router.get('/', productHandler.getProducts);
    router.get('/:id', productHandler.getProduct);
    router.put('/:id', role.isAdmin, multiparty, productHandler.changeProduct);
    router.delete('/:id', role.isAdmin, productHandler.deleteProduct);
    
    router.get('/:id/comments', productHandler.getProductComments);
    router.get('/search/:word', productHandler.searchProducts);

    return router;
};
