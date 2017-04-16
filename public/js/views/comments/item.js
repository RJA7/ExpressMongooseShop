define([
    'views/baseItem',
    'text!templates/comments/item.html'
], function (BaseItem, commentsItemTemplate) {
    return BaseItem.extend({
        contentType: 'comments',

        tpl: _.template(commentsItemTemplate)
    });
});
