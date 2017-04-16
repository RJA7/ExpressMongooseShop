var express = require('express');
var router = express.Router();
var BasketHandler = require('../handlers/baskets');

module.exports = function () {
    var basketHandler = new BasketHandler();

    router.post('/', basketHandler.createProducts);
    router.get('/', basketHandler.getProducts);
    router.put('/:id', basketHandler.addProduct);
    router.delete('/:id', basketHandler.deleteProduct);

    return router;
};