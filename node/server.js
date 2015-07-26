// nodejs server

require( 'buffer-equal-constant-time' ).install();

var express = require( 'express' );
var exec = require( 'child_process' ).exec;
var bodyParser = require( 'body-parser' );
var crypto = require( 'crypto' );

var app = express();

app.use( bodyParser.json() );

app.post( '/webhooks/rtaylordev', function ( req, res ) {
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

app.listen( 3999 );