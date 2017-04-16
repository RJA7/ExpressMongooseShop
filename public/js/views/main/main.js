define([
    'backbone',
    'views/main/header',
    'views/main/basket',
    'views/main/footer',
    'views/main/nav',
    'views/main/chat'
], function (Backbone, HeaderView, BasketView, FooterView, NavView, ChatView) {
    return Backbone.View.extend({
        el: $('#wrap'),

        events: {
            'click #mode': 'mode',
            'click #logout': 'logout',
            'click #search': 'search'
        },

        initialize: function () {
            this.render();

            this.$nav = $('#nav');
            this.$nav.visible = true;
            APP.chanel.on('clearNav', this.clearNav, this);
            APP.chanel.on('renderNav', this.renderNav, this);
            APP.chanel.on('login', this.login, this);
        },

        render: function () {
            $('#header').html(new HeaderView().$el);
            $('#basket').html(new BasketView().$el);
            $('#nav').html(new NavView().$el);
            $('#footer').html(new FooterView().$el);
            $('#chat').html(new ChatView().$el);
        },

        clearNav: function () {
            if (!this.$nav.visible) return;
            this.$nav.empty();
            this.$nav.removeClass('nav col-md-3');
            this.$nav.visible = false;
        },

        renderNav: function () {
            if (this.$nav.visible) return;
            this.$nav.html(new NavView().$el);
            this.$nav.addClass('nav col-md-3');
            this.$nav.visible = true;
        },

        mode: function (e) {
            var url = window.location.hash;
            e.preventDefault();
            APP.mode = !APP.mode;
            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        login: function () {
            require(['models/users'], function (UserModel) {
                var user = new UserModel({_id: 1});
                user.urlRoot = '/users';
                user.fetch({
                    success: function () {
                        user.has('name') ? APP.user = user : null;
                        user.has('admin') ? APP.admin = true : null;
                        $('#header').html(new HeaderView().$el);
                        $('#footer').html(new FooterView().$el);
                    }
                });
            });
        },

        logout: function (e) {
            e.preventDefault();
            require(['models/users'], function (Model) {
                var model = new Model();
                model.urlRoot = '/logout';
                model.fetch();
                model.on('sync', function () {
                    APP.user = false;
                    APP.admin = false;
                    APP.mode = false;
                    APP.chanel.trigger('logout');
                    $('#header').html(new HeaderView().$el);
                    $('#footer').html(new FooterView().$el);
                }, this)
            });
        },

        search: function () {
            var word = $('#searchBar').val();
            if (!word) return;

            require([
                'collections/products',
                'views/products/list'
            ], function (ProductCollection, ProductListView) {
                var products = new ProductCollection();
                products.url = '/products/search/' + word;
                products.fetch({reset: true});
                products.on('reset', function () {
                     if (products.length < 1) {
                         APP.chanel.trigger('error', {message: 'No result'});
                     } else {
                         new ProductListView({collection: products});
                     }
                });
            });
        }
    });
});
