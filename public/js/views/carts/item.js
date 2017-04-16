define([
    'views/baseItem',
    'text!templates/carts/item.html'
], function (BaseItem, cartsItemTemplate) {
    return BaseItem.extend({
        contentType: 'carts',

        tpl: _.template(cartsItemTemplate)
    });
});
