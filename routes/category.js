var express = require('express');
var router = express.Router();
var CategoryHandler = require('../handlers/categories');
var multiparty = require('connect-multiparty')();
var role = require('../helpers/role')();

module.exports = function () {
    var categoryHandler = new CategoryHandler();
    
    router.post('/', role.isAdmin, multiparty, categoryHandler.addCategory);
    router.get('/', categoryHandler.getCategories);
    router.get('/:id', categoryHandler.getCategory);
    router.put('/:id', role.isAdmin, multiparty, categoryHandler.changeCategory);
    router.delete('/:id', role.isAdmin, categoryHandler.deleteCategory);
    
    router.get('/:id/products', categoryHandler.getCategoryProducts);
    
    return router;
};
