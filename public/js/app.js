var APP = APP || {};

define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function ($, _, Backbone, Router) {
    var initialize = function () {
        var url = window.location.hash;
        new Router();

        Backbone.history.start({silent: true});

        require([
            'views/main/main',
            'models/users'
        ], function (MainView, UserModel) {
            var user = new UserModel({_id: 1});
            user.urlRoot = 'users';
            user.fetch({
                success: function () {
                    APP.user = user.has('name') ? user : null;
                    APP.admin = user.has('admin') ? true : null;
                    start();
                },
                error: function () {
                    start();
                }
            });

            function start () {
                new MainView();
                Backbone.history.fragment = '';
                Backbone.history.navigate(url, {trigger: true});
            }
        });
        
        APP.chanel = _.extend({}, Backbone.Events);
        APP.chanel.on('success', messageHandler);
        APP.chanel.on('error', errorHandler);
    };

    function messageHandler(res) {
        $('#error').css('background-color', '#E9E581');
        messageAlert(res);
    }

    function errorHandler(res) {
        $('#error').css('background-color', '#DF3D82');
        messageAlert(res);
    }

    function messageAlert (res) {
        var message = res.message;
        var timeout = message.length * 100;
        var $el = $('#error');

        if (timeout < 3000) {
            timeout = 3000;
        }

        if (message) {
            $el.html(message);
            $el.animate({left: '0%', opacity: '100'}, 'slow');
            setTimeout(function () {
                $el.animate({left: '-20%', opacity: '0'}, 'slow');
            }, timeout);
        }
    }

    return {
        initialize: initialize
    };
});
