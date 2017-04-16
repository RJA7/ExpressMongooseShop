require.config({
    paths: {
        jquery    : './libs/jQuery/dist/jquery.min',
        underscore: './libs/underscore/underscore-min',
        backbone  : './libs/backbone/backbone-min',
        socket     : '../socket.io/socket.io',
        text      : './libs/text/text',
        model     : './models',
        collection: './collections',
        template  : '../templates',
        templates : '../templates'
    },
    shim : {
        underscore: {
            exports : '_',
            backbone: ['underscore', 'jQuery'],
            app     : ['backbone']
        }
    }
});

require(['app'], function (app) {
    app.initialize();
});
