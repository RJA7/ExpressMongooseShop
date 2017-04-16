define([
    'backbone',
    'text!templates/pagination.html'
], function (Backbone, paginationTemplate) {
    return Backbone.View.extend({
        tpl: _.template(paginationTemplate),

        events: {
            'click a': 'page'
        },

        initialize: function (attrs) {
            attrs.totalCount = this.collection.length ? this.collection.toJSON()[0].totalCount : 0;
            attrs.pages = Math.ceil(attrs.totalCount / attrs.limit);
            this.attrs = attrs;

            this.render();
        },

        render: function () {
            this.$el.html(this.tpl(this.attrs));
        },

        page: function (e) {
            var page = e.target.name;
            var content = this.attrs.content;
            var id = this.attrs.id;
            var child = this.attrs.child;
            var limit = this.attrs.limit;
            var sort = this.attrs.sort;
            var order = this.attrs.order;
            var pages = this.attrs.pages;
            var url;

            e.preventDefault();
            e.stopPropagation();

            if ((page >= 1 && page <= pages) || page == 1) {
                if (id) {
                    url = '#app/'+ content +
                        '/id=' + id + '/child=' + child +
                        '/page=' + page + '/limit=' + limit +
                        '/sort=' + sort + '/order=' + order;
                } else {
                    url = '#app/' + content +
                        '/page=' + page + '/limit=' + limit +
                        '/sort=' + sort + '/order=' + order;
                }
                Backbone.history.navigate(url, {trigger: true});
            }
        }
    });
});
