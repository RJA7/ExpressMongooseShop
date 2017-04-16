define([
    'backbone',
    'text!templates/main/carousel.html'
], function (Backbone, carouselTemplate) {
    return Backbone.View.extend({
        el: $('#container'),
        
        tpl: _.template(carouselTemplate),

        initialize: function () {
            this.render();
        },

        render: function () {
            APP.chanel.trigger('clearNav');
            this.$el.html(this.tpl());
        }
    });
});
