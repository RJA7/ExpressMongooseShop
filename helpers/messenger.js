if (process.env.TWILIO_SID && process.env.AuthToken) {
    var client = require('twilio')(process.env.TWILIO_SID, process.env.AuthToken);
}
var logger = require('../libs/log')(module);

module.exports = function Messenger() {
    if (!(this instanceof Messenger)) {
        return new Messenger();
    }

    this.send = function (phone, message, type) {
        if (!client) {
            return logger.warn('Phone message not sent, cause there is no SID or AuthToken specified.');
        }

        var messageOptions = {
            to: phone,
            from: '+12013899687',
            body: message
        };

        if (type === 'accept') {
            messageOptions.body = 'Enter code ' + message;
        }
        
        if (type === 'forgot') {
            messageOptions.body = 'Enter code ' + message;
        }

        if (type === 'restore') {
            messageOptions.body = 'Your new password: ' + message;
        }

        client.sendMessage(messageOptions, function (err, res) {
                if (err) {
                    logger.error('Can\'t send phone message to ' + phone);
                }
                if (res) {
                    logger.info('Phone message sent to ' + phone + ' Type: ' + type);
                }
            }
        );
    };
};