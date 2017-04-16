define([
    'views/baseItem',
    'text!templates/admins/item.html'
], function (BaseItem, adminsItemTemplate) {
    return BaseItem.extend({
        contentType: 'admins',

        tpl: _.template(adminsItemTemplate)
    });
});
