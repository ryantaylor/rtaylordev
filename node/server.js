// nodejs server

require( 'buffer-equal-constant-time' ).install();

var express = require( 'express' );
var mu = require( 'mustache' );
var fs = require( 'fs' );
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

////////////////////////////
// Server action handlers //
////////////////////////////

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
  
  var antispam = req.body.contact.junk;
  
  try {
    // Check antispam input and abort if it contains text
    if ( !validator.isNull( antispam ) ) {
      console.log( 'spam detected, aborting' );
      res.redirect( '/contact' );
    }
    else {
      // Send email
      if ( sendContactEmail( req.body.contact.name, req.body.contact.email, req.body.contact.message ) ) {
        // Mail sent successfully
        renderTemplate( 'contact_result.html', { success: true, fail: false }, res );
      }
      else {
        // Email validation or send failed
        renderTemplate( 'contact_result.html', { success: false, fail: true }, res );
      }
    }
  } catch ( err ) {
    res.status( 500 ).send( 'A fatal server error occurred' );
  }
});

/////////////////////////////
// Server function helpers //
/////////////////////////////

function sendContactEmail( name, email, message ) {
  // Set transport to accept unsigned TLS connections
  var transporter = nodemailer.createTransport({
    tls: {
      rejectUnauthorized: false
    }
  });
  
  // Taken from HTML5 spec
  var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Check validation of form elements
  if ( validator.isNull( name ) ) {
    console.log( 'got empty name' );
    return false;
  }
  
  if ( validator.isNull( message ) ) {
    console.log( 'got empty message' );
    return false;
  }
  
  //if ( !validator.isEmail( email ) ) {
  if ( email.match( emailRegex ) == null ) {
    console.log( 'got invalid email' );
    return false;
  }
  
  // Construct email
  var subject = 'Contact - ' + name;
  var body = 'From: ' + name + '\nEmail: ' + email + '\nMessage: ' + message;
  
  // Send email via SMTP transport to Postfix
  transporter.sendMail({
    from: 'contact@ryantaylordev.ca',
    to: 'ryan@ryantaylordev.ca',
    subject: subject,
    text: body
  });
  
  return true;
}

function renderTemplate( template, data, res ) {
  var filepath = __dirname + '/../www/tmpl/' + template;
  
  fs.readFile( filepath, function ( err, html ) {
    if ( err ) throw err;
    res.send( mu.render( html.toString(), data ) );
  });
}

/////////////
// Do work //
/////////////

app.listen( 3999 );