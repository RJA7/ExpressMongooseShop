define([
    'views/baseList',
    'text!templates/comments/list.html'
], function (BaseList, commentListTemplate) {
    return BaseList.extend({
        contentType: 'comments',

        tpl: _.template(commentListTemplate)
    });
});
