var sha1 = require('sha1');

module.exports = function Crypter() {
    if (!(this instanceof Crypter)) {
        return new Crypter();
    }

    this.crypt = function (password) {
        return sha1(password);
    };
};