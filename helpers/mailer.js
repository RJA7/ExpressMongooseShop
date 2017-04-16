var nodeMailer = require('nodemailer');

if (process.env.SMTPS_SERVER) {
    var transporter = nodeMailer.createTransport(process.env.SMTPS_SERVER);
}
var logger = require('../libs/log')(module);

module.exports = function Mailer() {
    if (!(this instanceof Mailer)) {
        return new Mailer();
    }

    this.send = function (email, message, type) {
        if (!transporter) {
            return logger.warn('Email not sent, cause there is no smtp server specified.');
        }

        var mailOptions = {
            from: '"TechShop 👥" <techshop.pp.com>',
            to: email
        };

        if (type === 'accept') {
            mailOptions.subject = 'Confirmation ✔';
            mailOptions.html = '<b>Confirmation code: ' + message + '</b>';
        }

        if (type === 'forgot') {
            mailOptions.subject =  'Restore password ✔';
            mailOptions.html = '<b>Restore code: ' + message + '.</b>';
        }

        if (type === 'restore') {
            mailOptions.subject = 'Your new password ✔';
            mailOptions.html = '<b>New password: ' + message + '.</b>';
        }

        if (type === 'dispatch') {
            mailOptions.subject = 'News ✔';
            mailOptions.html = '<b>' + message + '</b>';
        }

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                logger.error('Can\'t send email message to ' + email);
                return console.log(error);
            }
            logger.info('Email message sent to ' + email + ' Type: ' + type);
        });
    }
};