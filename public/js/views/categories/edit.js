define([
    'views/baseEdit',
    'text!templates/categories/edit.html'
], function (BaseEdit, categoryEditTemplate) {
    return BaseEdit.extend({
        contentType: 'categories',

        tpl: _.template(categoryEditTemplate)
    });
});
