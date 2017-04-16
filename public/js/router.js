define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.Router.extend({
        view: null,

        routes: {
            'app/:content(/id=:id/child=:child)(/page=:page/limit=:limit)(/sort=:sort/order=:order)(/filter=:filter)': 'list',
            'app/:content(/id=:id(/:edit))': 'item',
            'app/': 'carousel',
            'login': 'login',
            'forgot': 'forgot',
            'dispatch': 'dispatch',
            '*all': 'all'
        },

        list: function (content, id, child, page, limit, sort, order, filter) {
            var self = this;
            var collectionUrl = 'collections/' + content;
            var viewUrl = 'views/' + content + '/list';

            if (child) {
                collectionUrl = 'collections/' + child;
                viewUrl = 'views/' + child + '/list';
            }

            this.view ? this.view.undelegateEvents() : null;

            require([
                collectionUrl,
                viewUrl
            ], function (Collection, View) {
                var collection = new Collection();

                if (child) {
                    collection.url = '/' + content + '/' + id + '/' + child;
                }

                page = page || 1;
                limit = limit || collection.limit;
                sort = sort || collection.sorts;
                order = order || 1;

                collection.fetch({
                    data: {
                        skip: (page - 1) * limit,
                        limit: limit,
                        sort: sort,
                        order: order,
                        filter: filter
                    },
                    reset: true,
                    success: function () {
                        self.view = new View({
                            collection: collection,
                            id: id,
                            child: child,
                            page: page,
                            limit: limit,
                            sort: sort,
                            order: order,
                            content: content
                        });
                    },
                    error: function (col, err) {
                        Backbone.history.navigate('#app/', {trigger: true});
                        APP.chanel.trigger('error', err.responseJSON);
                    }
                });
            });
        },

        item: function (content, id, edit) {
            var self = this;
            var viewUrl;
            var modelUrl = 'models/' + content;

            if (id == 'new' || edit == '/edit') {
                viewUrl = 'views/' + content + '/edit';
            } else {
                viewUrl = 'views/' + content + '/item';
            }

            self.view ? self.view.undelegateEvents() : null;

            require([
                modelUrl,
                viewUrl
            ], function (Model, View) {
                var model = new Model({_id: id});
                model.urlRoot = '/' + content;

                if (id == 'new') {
                    model.set('_id', null);
                    self.view = new View({model: model});
                    return;
                }

                model.fetch({
                    success: function () {
                        self.view = new View({model: model});
                    },
                    error: function () {
                        Backbone.history.navigate('#app/', {trigger: true});
                        APP.chanel.trigger('error', err.responseJSON);
                    }
                });
            });
        },

        login: function () {
            var self = this;

            if (APP.user) {
                return Backbone.history.navigate('#app/', {trigger: true});
            }
            self.view ? self.view.undelegateEvents() : null;

            require(['views/main/login'], function (LoginView) {
                self.view = new LoginView();
            });
        },

        forgot: function () {
            var self = this;

            if (APP.user) {
                return Backbone.history.navigate('#app/', {trigger: true});
            }
            self.view ? self.view.undelegateEvents() : null;

            require(['views/main/forgot'], function (ForgotView) {
                self.view = new ForgotView();
            });
        },

        carousel: function () {
            var self = this;
            self.view ? self.view.undelegateEvents() : null;

            require(['views/main/carousel'], function (CarouselView) {
                self.view = new CarouselView();
            });
        },

        dispatch: function () {
            var self = this;
            self.view ? self.view.undelegateEvents() : null;

            require(['views/main/dispatch'], function (DispatchView) {
                self.view = new DispatchView();
            });
        },

        all: function () {
            Backbone.history.navigate('#app/products', {replace: true, trigger: true});
            APP.chanel.trigger('error', {message: 'Not Fount'});
        }
    });
});
