define([
    'views/baseEdit',
    'text!templates/producers/edit.html'
], function (BaseEdit, producerEditTemplate) {
    return BaseEdit.extend({
        contentType: 'producers',

        tpl: _.template(producerEditTemplate)
    });
});
