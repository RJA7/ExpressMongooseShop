define([
    'backbone'
], function(Backbone) {
    return Backbone.Model.extend({
        idAttribute: '_id',
        
        defaults: {
            products: [],
            productsObj: []
        },

        initialize: function () {
            this.on('invalid', function (err) {
                APP.chanel.trigger('error', {message: err.validationError});
            });
        },

        validate: function (attrs) {
            if (!attrs.address) {
                return 'Put delivery address';
            }

            if (!attrs.products.length) {
                return 'Cart is empty';
            }
        }
    });
});
