define([
    'views/baseList',
    'text!templates/users/list.html'
], function (BaseList, userListTemplate) {
    return BaseList.extend({
        contentType: 'users',
        
        events: {
            'click #banUser': 'banUser',
            'click #edit'   : 'editItem',
            'click #delete' : 'deleteItem',
            'click #create' : 'createItem',
            'click th'     : 'sortToggle'
        },

        tpl: _.template(userListTemplate),

        banUser: function () {
            var banUsers = $('input:checked');
            var user;
            var i;
            for (i = 0; i < banUsers.length; i++) {
                user = this.collection.get(banUsers[i].name);
                user.attributes.status = false;
                user.save();
            }
            this.render();
        }
    });
});
