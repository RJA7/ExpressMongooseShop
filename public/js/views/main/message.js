define([
    'text!templates/main/message.html'
], function (messageTemplate) {
    return Backbone.View.extend({
        el: $('.chat'),

        tpl: _.template(messageTemplate),

        initialize: function (data) {
            this.data = data;
            this.render()
        },

        render: function () {
            this.$el.append(this.tpl(this.data));
        }
    });
});
