var Product = require('../models/product');
var validator = require('validator');
var logger = require('../libs/log')(module);

module.exports = function () {

    this.createProducts = function (req, res, next) {
        req.session.products = [];

        return res.status(200).send([]);
    };

    //PUT
    this.addProduct = function (req, res, next) {
        var id = req.params.id;
        var products = req.session.products || [];
        
        if (!validator.isMongoId(id)) {
            return next(Error('Wrong product id'));
        }
        
        products.push(id);
        req.session.products = products;

        return res.status(200).send(products);
    };

    this.getProducts = function (req, res, next) {
        var products = req.session.products || [];
        var queryObj = [];
        var i = products.length;
        if (!products.length) {
            return res.status(200).send([]);
        }

        for (; i--;) {
            queryObj.push({_id: products[i]});
        }

        Product
            .find({$or: queryObj})
            .exec(function (err, products) {
                if (err) {
                    return next(err);
                }

                return res.status(200).send(products);
            })
    };

    this.deleteProduct = function (req, res, next) {
        var products = req.session.products;
        var id = req.params.id;
        var index;
        if (!products) {
            return res.status(200).send([]);
        }

        while ((index = products.indexOf(id)) !== -1) {
            products.splice(index, 1);
            req.session.products = products;
        }

        return res.status(200).send(products);
    };
};
