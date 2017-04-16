define([
    'backbone',
    'views/pagination'
], function (Backbone, PaginationView) {
    return Backbone.View.extend({
        el: $('#container'),
        view: null,

        events: {
            'click #edit': 'editItem',
            'click #delete': 'deleteItem',
            'click #create': 'createItem',
            'click th': 'sortToggle'
        },

        initialize: function (attrs) {
            this.attrs = attrs;
            this.render();
        },

        render: function () {
            this.contentType != 'products' ? APP.chanel.trigger('clearNav') : APP.chanel.trigger('renderNav');

            this.$el.html(this.tpl({
                collection: this.collection.toJSON(),
                sorts: this.attrs.sort,
                order: this.attrs.order,
                limit: this.attrs.limit
            }));

            //pagination
            this.view ? this.view.undelegateEvents() : null;
            this.view = new PaginationView(this.attrs);
            this.$el.append(this.view.$el);
        },

        editItem: function () {
            var editItem = $('input:checked');
            var url;

            if (editItem.length > 1 || !editItem.length) {
                APP.chanel.trigger('error', {message: 'Choose one item'});
            } else {
                url = '#app/' + this.contentType + '/id=' + editItem[0].name + '/edit';
                Backbone.history.navigate(url, {trigger: true});
            }
        },

        deleteItem: function () {
            var deleteItems = $('input:checked');
            var model;
            var i;

            if (this.contentType == 'admins' && this.collection.length < 2) {
                APP.chanel.trigger('error', {message: 'Can\'t delete last admin!'});

                return;
            }

            if (!window.confirm('Delete?')) return;

            for (i = 0; i < deleteItems.length; i++) {
                model = this.collection.get(deleteItems[i].name);
                model.urlRoot = '/' + this.contentType;
                model.destroy();
                this.collection.remove(model);
            }
            APP.chanel.trigger('success', {message: 'Successfully removed'});
            this.render();
        },

        createItem: function () {
            var url = '#app/' + this.contentType + '/id=new';
            Backbone.history.navigate(url, {trigger: true});
        },

        sortToggle: function (e) {
            var sortField = e.currentTarget.id;
            var content = this.attrs.content;
            var id = this.attrs.id;
            var child = this.attrs.child;
            var page = this.attrs.page;
            var limit = this.attrs.limit;
            var sort = this.attrs.sort;
            var order = this.attrs.order;
            var url;

            if (!sortField) return;
            sort == sortField ? order = -(Number(order)) : order = 1;

            if (id) {
                url = '#app/' + content +
                    '/id=' + id + '/child=' + child +
                    '/page=' + page + '/limit=' + limit +
                    '/sort=' + sortField + '/order=' + order;
            } else {
                url = '#app/' + content +
                    '/page=' + page + '/limit=' + limit +
                    '/sort=' + sortField + '/order=' + order;
            }
            Backbone.history.navigate(url, {trigger: true});
        }
    });
});
