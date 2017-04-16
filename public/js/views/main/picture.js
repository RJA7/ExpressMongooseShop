define([
    'backbone',
    'text!templates/main/picture.html'
], function (Backbone, pictureTemplate) {
    return Backbone.View.extend({
        el: $('#picture'),
        
        tpl: _.template(pictureTemplate),

        events: {
            'click #close': 'close'
        },

        initialize: function (attrs) {
            var picturePath = attrs.picturePath;
            var aPicturePath = picturePath.split('.');
            aPicturePath[aPicturePath.length - 2] += '-big';
            this.picturePath = aPicturePath.join('.');

            this.render();
        },

        render: function () {
            this.$el.html(this.tpl({picturePath: this.picturePath}));
        },

        close: function (e) {
            this.$el.empty();
        }
    });
});
