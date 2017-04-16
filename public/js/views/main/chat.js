define([
    'views/baseList',
    'text!templates/main/chat.html',
    'socket'
], function (BaseList, chatTemplate, socket) {
    return Backbone.View.extend({
        tpl: _.template(chatTemplate),
        
        receiverId: null,
        label: true,

        events: {
            'click #open': 'chatToggle',
            'click #chatBtn': 'sendMessage',
            'click li.left': 'chooseReceiver',
            'keydown #chatInput': 'keyAction'
        },

        initialize: function () {
            this.io = socket.connect();
            this.io.on('message', this.appendMessage);
            APP.chanel.on('login', this.reconnect, this);
            APP.chanel.on('logout', this.reconnect, this);

            this.render();
        },

        render: function () {
            this.$el.html(this.tpl());
        },

        chatToggle: function (e) {
            var self = this;
            var collapse = $('#collapse');
            if (this.label) {
                $('#chats').animate({width: '350px'}, 'slow', function () {
                    $('#slideChat').slideDown('slow', function () {
                        self.label = !self.label;
                        collapse.removeClass('glyphicon-collapse-down');
                        collapse.addClass('glyphicon-collapse-up');
                    });
                });
            } else {
                $('#slideChat').slideUp('slow', function () {
                    $('#chats').animate({width: '150px'}, 'slow', function () {
                        self.label = !self.label;
                        collapse.removeClass('glyphicon-collapse-up');
                        collapse.addClass('glyphicon-collapse-down');
                    });
                });
            }
        },

        sendMessage : function (e) {
            var $input = $('#chatInput');
            var message = $input.val();
            var id = this.receiverId;

            if (!message) {
                return APP.chanel.trigger('error', {message: 'Put some message'});
            }

            if (APP.admin && !id) {
                return APP.chanel.trigger('error', {message: 'Choose receiver'});
            }

            this.io.emit('message', {message: message, id: id}, appendMyMessage);
            $input.val('');
        },

        chooseReceiver: function (e) {
            var $li = e.currentTarget;
            var userName = $($li).find('strong.primary-font').text();
            this.receiverId = $li.id;
            $('#chatInput').val(userName + ', ');
        },

        keyAction: function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) {
                this.sendMessage();
            }
        },

        appendMessage: function (data) {
            APP.chanel.trigger('success', {message: 'New chat message from ' + data.user.name});
            appendMyMessage(data);
        },

        reconnect: function () {
            this.io.disconnect();
            this.io.connect();
        }
    });

    function appendMyMessage(data) {
        require(['views/main/message'], function (MessageView) {
            new MessageView(data);
        });
    }
});
