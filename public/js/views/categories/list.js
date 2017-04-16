define([
    'views/baseList',
    'text!templates/categories/list.html'
], function (BaseList, categoryListTemplate) {
    return BaseList.extend({
        contentType: 'categories',

        tpl: _.template(categoryListTemplate)
    });
});
