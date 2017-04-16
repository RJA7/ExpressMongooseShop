define([
    'views/baseEdit',
    'text!templates/comments/edit.html'
], function (BaseEdit, commentEditTemplate) {
    return BaseEdit.extend({
        contentType: 'comments',

        tpl: _.template(commentEditTemplate)
    });
});
