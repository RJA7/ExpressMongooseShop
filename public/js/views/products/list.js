define([
    'views/baseList',
    'text!templates/products/list.html'
], function (BaseList, productListTemplate) {
    return BaseList.extend({
        contentType: 'products',

        events: {
            'click #edit': 'editItem',
            'click #delete': 'deleteItem',
            'click #create': 'createItem',
            'click #addToCart': 'addToCart',
            'change #sorts': 'sortChange',
            'change #order': 'orderChange',
            'change #limit': 'limitChange'
        },

        tpl: _.template(productListTemplate),

        addToCart: function (e) {
            var id = e.currentTarget.name;
            e.preventDefault();
            APP.chanel.trigger('addToCart', id);
        },

        sortChange: function (e) {
            var fakeE = {currentTarget: {id: e.currentTarget.value}};
            this.sortToggle(fakeE);
        },

        orderChange: function (e) {
            var fakeE = {currentTarget: {id: $('#sorts').val()}};
            this.sortToggle(fakeE);
        },

        limitChange: function (e) {
            var limit;

            if ((limit = e.currentTarget.value) < 1) {
                return;
            }

            this.attrs.limit = limit;
            this.attrs.order = -(Number(this.attrs.order));
            this.orderChange(e);
        }
    });
});
