define([
    'views/baseItem',
    'text!templates/users/item.html'
], function (BaseItem, userItemTemplate) {
    return BaseItem.extend({
        contentType: 'users',

        tpl: _.template(userItemTemplate)
    });
});
