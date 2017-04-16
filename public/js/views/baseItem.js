define([
    'backbone'
], function (Backbone) {
    return Backbone.View.extend({
        el: $('#container'),

        events: {
            'click #edit': 'edit',
            'click #delete': 'deleteItem',
            'click img.img-rounded': 'zoom'
        },

        initialize: function () {
            APP.chanel.trigger('clearNav');
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl(this.model.toJSON()));
        },

        edit: function (e) {
            var url = '#app/' + this.contentType + '/id=' + this.model.id + '/edit';
            Backbone.history.navigate(url, {trigger: true});
        },

        deleteItem: function (e) {
            if (!window.confirm('You really want to delete this ' +
                    this.contentType.slice(0, -1) + '?')) {

                return;
            }

            this.model.destroy({
                success: function () {
                    APP.chanel.trigger('success', {message: 'Successfully removed'});
                },
                error: function (err) {
                    APP.chanel.trigger('error', err.responseJSON);
                }
            });
            Backbone.history.history.back({replace: true});
        },

        zoom: function (e) {
            var picturePath = e.currentTarget.src;
            require(['views/main/picture'], function (PictureView) {
                new PictureView({picturePath: picturePath});
            });
        }
    });
});
