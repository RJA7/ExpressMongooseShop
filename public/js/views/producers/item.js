define([
    'views/baseItem',
    'text!templates/producers/item.html'
], function (BaseItem, producersItemTemplate) {
    return BaseItem.extend({
        contentType: 'producers',

        tpl: _.template(producersItemTemplate)
    });
});
