define([
    'views/baseList',
    'collections/categories',
    'collection/producers',
    'text!templates/main/nav.html'
], function (BaseList, CategoryCollection, ProducerCollection, navTemplate) {
    return Backbone.View.extend({
        tpl: _.template(navTemplate),

        events: {
            'click button': 'category',
            'click button.producer': 'producer',
            'click input[type="checkbox"]': 'filter'
        },

        initialize: function () {
            this.categories = new CategoryCollection();
            this.categories.fetch({reset: true});
            this.categories.on('reset', function () {
                this.producers = new ProducerCollection();
                this.producers.fetch({reset: true});
                this.producers.on('reset', this.render, this);
            }, this);
        },

        render: function () {
            this.$el.html(this.tpl({
                categories: this.categories.toJSON(),
                producers: this.producers.toJSON()
            }));
        },

        category: function (e) {
            var id = e.target.id;
            var url = '#app/products/filter=' + id;
            $('button').removeClass('active');
            $('#' + id).addClass('active');
            Backbone.history.navigate(url, {trigger: true});
        },

        producer: function (e) {
            var id = e.target.id;
            var url = '#app/producers/id=' + id + '/child=products';
            $('button').removeClass('active');
            $('#' + id).addClass('active');
            Backbone.history.navigate(url, {trigger: true});
        },

        filter: function (e) {
            e.stopPropagation();
            var aChecked = $('input[type="checkbox"]:checked');
            var i = aChecked.length;
            var filter = '';
            var url;

            while (i--) {
                filter += aChecked[i].closest('button').id + ',';
            }
            filter = filter ? filter.slice(0, -1) : '';

            url = '#app/products/filter=' + filter;
            Backbone.history.navigate(url, {trigger: true});
        }
    });
});
