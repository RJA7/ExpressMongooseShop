define([
    'backbone'
], function (Backbone) {
    return Backbone.View.extend({
        el: $('#container'),

        events: {
            'click #save': 'save'
        },

        initialize: function () {
            APP.chanel.trigger('clearNav');
            this.render();
        },

        render: function () {
            this.$el.html(this.tpl(this.model.toJSON()));
        },

        save: function (e) {
            e.preventDefault();
            var self = this;
            var hasPicture = false;
            var formData = new FormData($('form.form-horizontal')[0]);
            var url = '/' + this.contentType;
            var method = 'POST';
            var props = $('.form-control');
            var i = props.length;

            while (i--) {
                this.model.set(props[i].name, props[i].value);
                props[i].name == 'picture' ? hasPicture = true : null;
            }

            if (!hasPicture) {
                this.model.save(null, {
                    success: function (attrs) {
                        self.render();
                        APP.chanel.trigger('success', {message: 'Saved'});
                    },
                    error: function (err) {
                        APP.chanel.trigger('error', err.responseJSON);
                    }
                });

                return;
            }

            //if picture
            if (!this.model.isValid()) return;
            if (!this.model.isNew()) {
                url = '/' + this.contentType + '/' + this.model.id;
                method = 'PUT';
            }
            $.ajax({
                url: url,
                type: method,
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (attrs) {
                    self.model.attributes = attrs;
                    self.render();
                    APP.chanel.trigger('success', {message: 'Saved'});
                },
                error: function (err) {
                    APP.chanel.trigger('error', err.responseJSON);
                }
            });
        }
    });
});
