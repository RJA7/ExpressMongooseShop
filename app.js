var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var httpSession = require('./libs/httpSession');
var helmet = require('helmet');
var consolidate = require('consolidate');

module.exports = function () {
    var app = express();

    app.engine('html', consolidate.underscore);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'html');

    app.use(helmet());
    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(logger('dev'));
    app.use(httpSession());

    require('./routes/index')(app);
    
    return app;
};
