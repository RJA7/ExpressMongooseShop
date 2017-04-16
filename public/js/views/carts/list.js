define([
    'views/baseList',
    'text!templates/carts/list.html'
], function (BaseList, userListTemplate) {
    return BaseList.extend({
        contentType: 'carts',

        tpl: _.template(userListTemplate)
    });
});
