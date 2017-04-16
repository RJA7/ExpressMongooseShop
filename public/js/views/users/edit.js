define([
    'views/baseEdit',
    'text!templates/users/edit.html'
], function (BaseEdit, userEditTemplate) {
    return BaseEdit.extend({
        contentType: 'users',

        tpl: _.template(userEditTemplate)
    });
});
