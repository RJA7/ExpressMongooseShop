var fs = require('fs');
var gm = require('gm');
var randomString = require('random-strings');
var logger = require('../libs/log')(module);
var deasync = require('deasync');

module.exports = function Imager() {
    if (!(this instanceof Imager)) {
        return new Imager();
    }

    this.exec = function (oImage, options) {
        if (!oImage) {
            return;
        }
        
        options = options || {};
        var sync = true;
        var width = options.width || 400;
        var baseUrl = options.baseUrl || '/images/';

        var extension = oImage.name.split('.').pop() || 'jpg';
        var random = randomString.alphaNumMixed(10);
        var bigFileName = random + '-big' + '.' + extension;
        var smallFileName = random + '.' + extension;
        var bigUploadPath = './public' + baseUrl + bigFileName;
        var smallUploadPath = './public' + baseUrl + smallFileName;

        fs.rename(oImage.path, bigUploadPath, function (err) {
            if (err) {
                logger.error(err);
            }
            logger.debug('Image saved to ' + baseUrl + bigFileName);

            gm(bigUploadPath)
                .resize(width)
                .autoOrient()
                .write(smallUploadPath, function (err) {
                    if (err) console.log(err);

                    sync = false;
                });
        });

        while(sync) {deasync.sleep(100);}
        return baseUrl + smallFileName;
    };
};
