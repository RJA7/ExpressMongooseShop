define([
    'views/baseItem',
    'text!templates/categories/item.html'
], function (BaseItem, categoriesItemTemplate) {
    return BaseItem.extend({
        contentType: 'categories',

        tpl: _.template(categoriesItemTemplate)
    });
});
