define([
    'backbone',
    'underscore',
    'collections/categories',
    'collections/producers',
    'text!templates/main/footer.html'
], function (Backbone, _, CategoryCollection, ProducerCollection, footerTemplate) {
    return Backbone.View.extend({
        tpl: _.template(footerTemplate),
        
        initialize: function () {
            this.categories = new CategoryCollection();
            this.categories.fetch({reset: true});
            this.categories.on('reset', function () {
                this.producers = new ProducerCollection();
                this.producers.fetch({reset: true});
                this.producers.on('reset', this.render, this);
            }, this);
        },

        render: function () {
            this.$el.html(this.tpl({
                categories: this.categories.toJSON(),
                producers: this.producers.toJSON()
            }));
        }
    });
});
