define([
    'backbone',
    'text!templates/carts/confirm.html'
], function (Backbone, cartConfirmTemplate) {
    return Backbone.View.extend({
        el: $('#container'),

        tpl: _.template(cartConfirmTemplate),

        events: {
            'click #confirm': 'confirm',
            'change #amount': 'amount'
        },

        contentType: 'carts',

        initialize: function () {
            APP.chanel.trigger('clearNav');
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl({collection: this.collection.toJSON()}));
        },

        confirm: function () {
            var self = this;
            var address = $('textarea[name="address"]').val();

            require(['models/carts'], function (CartModel) {
                var i = self.collection.length;
                var cart = new CartModel();
                var productObj = {};
                var totalPrice = 0;
                var amount;
                var id;
                cart.urlRoot = '/carts';

                while (i--) {
                    id = self.collection.at(i).id;
                    amount = Number(self.collection.at(i).get('amount')) || 1;
                    productObj.id = id;
                    productObj.amount = amount;
                    cart.attributes.products.push(id);
                    cart.attributes.productsObj.push(productObj);
                    totalPrice += Number(self.collection.at(i).get('price')) * amount;
                }
                cart.set('totalPrice', totalPrice);
                cart.set('address', address);
                cart.save(null, {
                    success: function () {
                        APP.chanel.trigger('success', {message: 'Successfully confirmed'});
                        APP.chanel.trigger('clearBasket');
                        var url = '#app/carts/id=' + cart.id;
                        Backbone.history.navigate(url, {trigger: true, replace: true});
                    }
                });
            });
        },

        amount: function (e) {
            var amount = e.currentTarget.value;
            var id = e.currentTarget.name;
            var model = this.collection.get(id);
            model.set('amount', amount);
            this.render();
        }
    });
});
