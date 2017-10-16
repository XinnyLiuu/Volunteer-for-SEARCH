const nodemailer = require('nodemailer');
const smtpTransport = nodemailer.createTransport ({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
  }
});

exports.getHome = (req, res) => {
    res.render('static/home');
};

exports.getSignUp = (req, res) => {
  res.render('static/user');
};

exports.contactMe = (req,res) => {
  req.assert('name', 'Please include your name!').notEmpty();
  req.assert('email', 'Please include your email!').isEmail();
  req.assert('message', 'Please include a message!').notEmpty();

  const errors = req.validationErrors();

  if(errors) {
      req.flash('errors', errors);
      return res.redirect('/');
  }

  const mailOptions = {
      to: process.env.MAILER_USER,
      subject: 'Message Received From ' + req.body.name + ' @ ' + req.body.email,
      text: req.body.message
  }

  smtpTransport.sendMail(mailOptions, (error) => {
      if(error){
          req.flash('errors', {msg: 'An error has occured. Please try again!'});
          return res.redirect('/');
      }
       req.flash('success', {msg: 'Thanks for your time! I will get back to you as soon as possible!'});
       res.redirect('/');
  });
};
