define([
    'backbone',
    'models/dispatch',
    'text!templates/main/dispatch.html'
], function (Backbone, Model, dispatchTemplate) {
    return Backbone.View.extend({
        el: $('#container'),
        
        tpl: _.template(dispatchTemplate),

        events: {
            'click #send': 'send'
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            APP.chanel.trigger('clearNav');
            this.$el.html(this.tpl());
        },

        send: function (e) {
            var date = $('#date').val();
            var message = $('#message').val();
            var type = $('input[name="type"]:checked')[0].value;
            var model = new Model({date: date, message: message, type: type});

            model.urlRoot = '/dispatch';
            model.save(null, {
                success: function () {
                    APP.chanel.trigger('success', {message: model.get('message')});
                }
            });
        }
    });
});
