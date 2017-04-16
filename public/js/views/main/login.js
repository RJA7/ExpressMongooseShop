define([
    'text!templates/main/login.html',
    'models/users'
], function (loginTemplate, UserModel) {
    return Backbone.View.extend({
        el: $('#container'),

        tpl: _.template(loginTemplate),

        events: {
            'click #login-form-link': 'loginPage',
            'click #register-form-link': 'registerPage',
            'click #login-submit': 'loginSubmit',
            'click #register-submit': 'registerSubmit'
        },

        initialize: function () {
            APP.chanel.trigger('clearNav');
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl());
        },

        loginPage: function (e) {
            $('#login-form').delay(100).fadeIn(100);
            $('#register-form').fadeOut(100);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        },

        registerPage: function (e) {
            $('#register-form').delay(100).fadeIn(100);
            $('#login-form').fadeOut(100);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        },

        loginSubmit: function (e) {
            e.preventDefault();
            var login = $('#login');
            var password = $('#password');
            var code = $('#code');
            var rememberMe = $('#rememberMe');
            var user = new UserModel({
                login: login.val(),
                password: password.val(),
                code: code.val(),
                rememberMe: rememberMe.is(":checked")
            });
            user.urlRoot = '/login';
            user.on('sync', function () {
                var message = user.get('message');
                if (user.has('error')) {
                    return APP.chanel.trigger('error', {message: message});
                }
                if (user.has('codec')) {
                    APP.chanel.trigger('success', {message: message});
                    return $('#loginSlider').slideDown(1000);
                }
                if (user.has('success')) {
                    APP.chanel.trigger('success', {message: message});
                    APP.chanel.trigger('login');
                    return Backbone.history.navigate('#app/', {trigger: true});
                }
            }, this);
            user.save(null, {validate: false});
        },

        registerSubmit: function (e) {
            e.preventDefault();
            var self = this;
            var name = $('#name');
            var phone = $('#phone');
            var email = $('#email');
            var password = $('#regPassword');
            var confirmPassword = $('#confirmPassword');
            var user = new UserModel({
                name: name.val(),
                phone: phone.val(),
                email: email.val(),
                password: password.val(),
                confirmPassword: confirmPassword.val()
            });
            user.urlRoot = '/register';
            user.on('sync', function () {
                var message = user.get('message');
                if (user.has('success')) {
                    APP.chanel.trigger('success', {message: message});
                    return self.loginPage();
                } else {
                    APP.chanel.trigger('error', {message: message});
                }
            }, this);
            user.save();
        }
    });
});
