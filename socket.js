var socketio = require('socket.io');
var httpSession = require('./libs/httpSession')();
var emily = {name: 'Emily', picturePath: '/images/users/default.jpg'};
var admin;
var i = 1;

module.exports = function (server) {
    var sockets = socketio(server);

    sockets.use(function (socket, next) {
        httpSession(socket.request, socket.request.res, next);
    });

    sockets.on('connection', function (socket) {
        var user = socket.request.session.user || {};
        user.name = socket.request.session.name || 'Guest' + i++;
        user.id = socket.id;
        if (user.role == 'ADMIN') {
            admin = user;
            socket.emit('message', {user: emily, message: 'Hello Admin!'});
            socket.broadcast.emit('message', {user: emily, message: 'Admin is online'});
        } else if (admin) {
            socket.broadcast.to(admin.id).emit('message', {user: emily, message: user.name + ' is online'});
            socket.emit('message', {user: emily, message: 'Admin is online'});
        } else if (!admin) {
            socket.emit('message', {user: emily, message: 'Admin is offline'});
        }

        socket.on('message', function (data, cb) {
            var id;
            if (!admin) {
                return socket.emit('message', {user: emily, message: 'Admin is offline'});
            }
            id = data.id || admin.id;
            data.user = user;
            socket.broadcast.to(id).emit('message', data);

            cb(data);
        });
        
        socket.on('disconnect', function () {
             if (admin && socket.id == admin.id) {
                 admin = null;
                 socket.broadcast.emit('message', {user: emily, message: 'Admin is offline'});
             } else if (admin) {
                 socket.broadcast.to(admin.id).emit('message', {user: emily, message: user.name + ' disconnect'});
             }
        });
    });
};
