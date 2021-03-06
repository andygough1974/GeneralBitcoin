var express = require('express');
var router = express.Router();

var config = require('./../config/config');

var mailgun = require('mailgun-js')({
    apiKey: config.mailgun_api_key,
    domain: config.mailgun_domain
});

router.route('/contactus')
    .post(function onRequest(req, res, next) {

        req.assert('name', 'Name is required').notEmpty();
        req.assert('phone', 'Phone Number is required').notEmpty();
        req.assert('message', 'Message is required').notEmpty();
        req.assert('email', 'Email Address is required').notEmpty();
        req.assert('email', 'A valid email is required').isEmail();

        req.sanitize('message').toString();

        var errors = req.validationErrors();

        if (!errors) {
            var email = req.body.email;
            var phone = req.body.phone;
            var message = req.body.message;
            var name = req.body.name;

            var email = {
                from: email,
                to: config.email_support,
                subject: 'Contact form submitted by: ' + name,
                text: 'You have received a new message. \n\n Here are the details:\n \nName: ' + name + '\n Email: ' + email + ' \n Message \n ' + message
            };
            mailgun.messages().send(email, function(err, body) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                } else {
                    return res.status(200).json({
                        return: true
                    });
                }
            });
        } else {
            return res.status(200).json({
                error: errors
            });
        }
    });

module.exports = router;
