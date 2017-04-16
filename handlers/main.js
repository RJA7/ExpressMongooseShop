var path = require('path');

module.exports = function () {
    this.getPage = function (req, res, next) {
        res.sendFile(path.join(__dirname.split('\\').slice(0, -1).join('\\'), 'index.html'));
    };
};
