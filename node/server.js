// nodejs server

require( 'buffer-equal-constant-time' ).install();

var express = require( 'express' );
var exec = require( 'child_process' ).exec;
var bodyParser = require( 'body-parser' );
var crypto = require( 'crypto' );

var app = express();

app.use( bodyParser.json() );

app.post( '/webhooks/rtaylordev', function ( req, res ) {
	var hmac = crypto.createHmac( 'sha1', process.env.WHSECRET_RTAYLORDEV );
	hmac.update( JSON.stringify( req.body ) );

	var calcSignature = new Buffer( 'sha1=' + hmac.digest( 'hex' ) );
	var servSignature = new Buffer( req.headers['x-hub-signature'] );

	console.log( 'got webhook for rtaylordev from %s', req.headers['x-real-ip'] );

	if ( calcSignature.equal( servSignature ) ) {
		var options = { env: process.env };
		exec( 'cd /home/ryan/web/rtaylordev && git pull', options, function ( error, stdout, stderr ) {
			console.log( 'stdout: ' + stdout );
			console.log( 'stderr: ' + stderr );
			console.log( 'error: ' + error );
		});
	}
	else
		console.log( 'signature mismatch error!' );

	res.status( 200 ).send( 'OK' );
});

app.listen( 3999 );
console.log( 'Listening on port 3999' );
console.log( 'this is a test' );