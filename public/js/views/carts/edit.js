define([
    'views/baseEdit',
    'text!templates/carts/edit.html'
], function (BaseEdit, cartEditTemplate) {
    return BaseEdit.extend({
        contentType: 'carts',

        tpl: _.template(cartEditTemplate)
    });
});
