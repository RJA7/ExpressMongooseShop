var User = require('../models/user');
var validator = require('../helpers/validator')();
var mailer = require('../helpers/mailer')();
var messenger = require('../helpers/messenger')();
var logger = require('../libs/log')(module);

module.exports = function () {

    this.send = function (req, res, next) {
        var body = req.body || {};
        var dispatchType = body.type || 'email';
        var edgeDate = body.date || Date.now() - 3600 * 24 * 30000;
        var message = body.message;
        var result = '';
        var i;

        if (!message || message === '') {
            return next(Error('Message is required'));
        }

        User
            //.where('lastVisited').lt(edgeDate)
            .where('role').equals('USER')
            .exec(function (err, users) {
                if (err) {
                    return next(err);
                }

                for (i = 0; i < users.length; i++) {
                    if (dispatchType === 'phone') {
                        //messenger.send(users[i].phone, message, 'dispatch');
                        result += users[i].name + '\n';
                    }

                    if (dispatchType === 'email') {
                        //mailer.send(users[i].email, message, 'dispatch');
                        result += users[i].name + '\n';
                    }
                }

                return res.status(200).send({message: 'Successfully sent to ' + result});
            })
    }
};
