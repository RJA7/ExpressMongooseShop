var express = require('express');
var router = express.Router();
var ProducerHandler = require('../handlers/producers');
var multiparty = require('connect-multiparty')();
var role = require('../helpers/role')();

module.exports = function () {
    var producerHandler = new ProducerHandler();
    
    router.post('/', role.isAdmin, multiparty, producerHandler.addProducer);
    router.get('/', producerHandler.getProducers);
    router.get('/:id', producerHandler.getProducer);
    router.put('/:id', role.isAdmin, multiparty, producerHandler.changeProducer);
    router.delete('/:id', role.isAdmin, producerHandler.deleteProducer);
    
    router.get('/:id/products', producerHandler.getProducerProducts);

    return router;
};
