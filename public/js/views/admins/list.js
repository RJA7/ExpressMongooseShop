define([
    'views/baseList',
    'text!templates/admins/list.html'
], function (BaseList, userListTemplate) {
    return BaseList.extend({
        contentType: 'admins',

        tpl: _.template(userListTemplate)
    });
});
