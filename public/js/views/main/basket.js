define([
    'backbone',
    'underscore',
    'models/baskets',
    'collections/baskets',
    'text!templates/main/basket.html'
], function (Backbone, _, BasketModel, BasketCollection, basketTemplate) {
    return Backbone.View.extend({
        tpl: _.template(basketTemplate),
        
        slider: false,
        view: null,

        events: {
            'mouseover #slider': 'slideDown',
            'mouseleave #slider': 'slideUp',
            'click .glyphicon-remove': 'deleteProduct',
            'click #confirm': 'confirm',
            'click button.admin': 'refTo'
        },

        initialize: function () {
            this.collection = new BasketCollection();
            this.collection.on('reset', this.render, this);
            this.collection.fetch({reset: true});

            APP.chanel.on('addToCart', this.addToCart, this);
            APP.chanel.on('clearBasket', this.clearBasket, this);
        },

        render: function () {
            this.$el.html(this.tpl({collection: this.collection.toJSON(), slider: this.slider}));
        },

        slideDown: function () {
            $('#panel').stop().slideDown(500);
            this.slider = true;
        },

        slideUp: function () {
            $('#panel').slideUp(1000);
            this.slider = false;
        },

        addToCart: function (id) {
            var model = new BasketModel({_id: id}, {collection: this.collection});
            model.on('sync', function () {
                this.collection.fetch({reset: true});
            }, this);
            model.save();
            APP.chanel.trigger('success', {message: 'Added to cart'});
        },

        deleteProduct: function (e) {
            var id = e.currentTarget.id;
            var model = this.collection.get(id);
            e.preventDefault();
            model.on('destroy', function () {
                this.collection.fetch({reset: true});
            }, this);
            model.destroy();
        },
        
        confirm: function () {
            var self = this;
            $('#panel').slideToggle(1000);

            if(!APP.user) {
                return Backbone.history.navigate('#login', {trigger: true});
            }
            
            require(['views/carts/confirm'], function (CartConfirmView) {
                self.view ? self.view.undelegateEvents() : null;
                self.view = new CartConfirmView({collection: self.collection});
            });
        },

        clearBasket: function () {
            var model = new BasketModel({}, {collection: this.collection});
            model.save();
            this.collection.reset();
        },

        refTo: function (e) {
            var content = e.currentTarget.name;
            var url = '#app/' + content;
            Backbone.history.navigate(url, {trigger: true});
        }
    });
});
