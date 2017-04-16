define([
    'views/baseEdit',
    'text!templates/products/edit.html',
    'collections/categories',
    'collections/producers'
], function (BaseEdit, productEditTemplate, CategoryCollection, ProducerCollection) {
    return BaseEdit.extend({
        el: $('#container'),
        
        contentType: 'products',

        events: {
            'click #save': 'save'
        },
        
        initialize: function () {
            APP.chanel.trigger('clearNav');
            this.categories = new CategoryCollection();
            this.producers = new ProducerCollection();
            this.categories.fetch({reset: true});
            this.categories.on('reset', function () {
                this.producers.fetch({reset: true});
            }, this);
            this.producers.on('reset', this.render, this);
        },
        
        tpl: _.template(productEditTemplate),

        render: function () {
            this.$el.html(this.tpl({
                product: this.model.toJSON(),
                categories: this.categories.toJSON(),
                producers: this.producers.toJSON()
            }));
        }
    });
});
