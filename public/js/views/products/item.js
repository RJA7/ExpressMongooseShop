define([
    'views/baseItem',
    'text!templates/products/item.html',
    'collections/comments'
], function (BaseItem, productsItemTemplate, CommentCollection) {
    return BaseItem.extend({
        el: $('#container'),

        contentType: 'products',

        events: {
            'click #edit': 'edit',
            'click #delete': 'deleteItem',
            'click #addComment': 'addComment',
            'click #editComment': 'editComment',
            'click #deleteComment': 'deleteComment',
            'click #addToCart': 'addToCart',
            'click img.img-rounded': 'zoom'
        },

        tpl: _.template(productsItemTemplate),
        
        initialize: function () {
            APP.chanel.trigger('clearNav');
            this.commentCollection = new CommentCollection();
            this.commentCollection.url = '/products/' + this.model.id + '/comments';
            this.commentCollection.fetch({reset: true});
            this.commentCollection.on('reset', function () {
                this.render();
            }, this);
        },

        render: function () {
            this.model.set('comments', this.commentCollection.toJSON());
            this.$el.html(this.tpl(this.model.toJSON()));
        },

        addComment: function (e) {
            var self = this;
            var title = $('#title').val();
            var body = $('#body').val();
            var product = this.model.id;

            require(['models/comments'], function (CommentModel) {
                var comment = new CommentModel({
                    title: title,
                    body: body,
                    product: product
                });
                comment.urlRoot = '/comments';
                comment.save();
                comment.on('sync', function () {
                    self.commentCollection.fetch({reset: true});
                });
            });
        },

        editComment: function (e) {
            var id = e.currentTarget.name;
            var url = '#app/comments/id=' + id + '/edit';
            Backbone.history.navigate(url, {trigger: true});
        },

        deleteComment: function (e) {
            var self = this;
            var id = e.currentTarget.name;
            var comment = this.commentCollection.get(id);
            comment.urlRoot = '/comments';
            comment.destroy({
                success: function () {
                    self.render();
                }
            });
        },
        
        addToCart: function (e) {
            var id = e.currentTarget.name;
            e.preventDefault();
            APP.chanel.trigger('addToCart', id);
        }
    });
});
