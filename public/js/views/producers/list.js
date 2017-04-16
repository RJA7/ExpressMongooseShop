define([
    'views/baseList',
    'text!templates/producers/list.html'
], function (BaseList, producerListTemplate) {
    return BaseList.extend({
        contentType: 'producers',

        tpl: _.template(producerListTemplate)
    });
});
