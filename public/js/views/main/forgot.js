define([
    'text!templates/main/forgot.html',
    'models/users'
], function (forgotTemplate, UserModel) {
    return Backbone.View.extend({
        el: $('#container'),

        tpl: _.template(forgotTemplate),
        
        events: {
            'click #login-submit': 'submit'
        },

        initialize: function () {
            APP.chanel.trigger('clearNav');
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl());
        },

        submit: function (e) {
            e.preventDefault();
            var login = $('#login');
            var code = $('#code');
            var user = new UserModel({
                login: login.val(),
                code: code.val()
            });
            user.on('sync', function () {
                var message = user.get('message');
                if (user.has('error')) {
                    APP.chanel.trigger('error', {message: message});
                }
                if (user.has('codec')) {
                    APP.chanel.trigger('success', {message: message});
                    $('#loginSlider').slideDown(1000);
                }
                if (user.has('success')) {
                    APP.chanel.trigger('success', {message: message});
                }
                if (user.has('request')) {
                    code.val('');
                    $('#loginSlider').slideUp(1000);
                }
            });
            user.urlRoot = '/forgot';
            user.save(null, {validate: false});
        }
    });
});
