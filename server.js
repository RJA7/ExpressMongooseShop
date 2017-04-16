var env = process.env.NODE_ENV || 'development';
require('./config/' + env);
var app = require('./app')();
var http = require('http');
var logger = require('./libs/log')(module);
var db = require('./db');

var port = parseInt(process.env.PORT) || 80;

app.set('db', db);

var server = http.createServer(app).listen(port);
require('./socket')(server);

server.on('error', onError);
server.on('listening', onListening);


function onError(error) {
    switch (error.code) {
        case 'EACCES':
            logger.error('Port ' + port + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error('Port ' + port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    console.log('Ok');
    logger.info('Listening on http://localhost:' + port + '/');
}
