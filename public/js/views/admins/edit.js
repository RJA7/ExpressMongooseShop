define([
    'views/baseEdit',
    'text!templates/admins/edit.html'
], function (BaseEdit, adminEditTemplate) {
    return BaseEdit.extend({
        contentType: 'admins',

        tpl: _.template(adminEditTemplate)
    });
});
