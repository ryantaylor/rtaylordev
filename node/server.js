// nodejs server

require( 'buffer-equal-constant-time' ).install();

var express = require( 'express' );
var exec = require( 'child_process' ).exec;
var bodyParser = require( 'body-parser' );
var crypto = require( 'crypto' );
var nodemailer = require( 'nodemailer' );
var smtpTransport = require( 'nodemailer-smtp-transport' );
var validator = require( 'validator' );

var app = express();

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
  extended: true
}) );

app.post( '/webhooks/rtaylordev', function ( req, res ) {
  console.log( 'got rtaylordev webhook post' );
  
  try {
    var hmac = crypto.createHmac( 'sha1', process.env.WHSECRET_RTAYLORDEV );
    hmac.update( JSON.stringify( req.body ) );

    var calcSignature = new Buffer( 'sha1=' + hmac.digest( 'hex' ) );
    var servSignature = new Buffer( req.headers['x-hub-signature'] );

    if ( calcSignature.equal( servSignature ) ) {
      var options = { env: process.env };
      exec( 'cd /home/ryan/web/rtaylordev && git pull', options, function ( error, stdout, stderr ) {
        if ( error == null )
          res.status( 200 ).send( stdout + stderr );
        else
          res.status( 500 ).send( 'There was an issue pulling from the repository\nData was not updated' );
      });
    }
    else
      res.status( 401 ).send( 'Signature mismatch' );
  }
  catch ( exception ) {
    res.status( 500 ).send( 'The action could not be completed' );
  }
});

app.post( '/contact/send', function ( req, res ) {
  console.log( 'got contact post' );
  
  var transporter = nodemailer.createTransport({
    tls: {
      rejectUnauthorized: false
    }
  });
  
  //var name = validator.escape( req.body.contact.name );
  //var email = validator.escape( req.body.contact.email );
  //var message = validator.escape( req.body.contact.message );
  
  if ( validator.isEmail( email ) ) {
    console.log( 'valid email ' + email );
    email = validator.normalizeEmail();
  }
  
  var subject = 'Contact - ' + name;
  var body = 'From: ' + name + '\nEmail: ' + email + '\nMessage: ' + message;
  
  console.log( subject );
  console.log( body );
  
  transporter.sendMail({
    from: 'contact@ryantaylordev.ca',
    to: 'ryan@ryantaylordev.ca',
    subject: subject,
    text: body
  });
  
  //res.status( 200 ).send( 'success' );
  res.redirect( '/contact' );
});

app.listen( 3999 );