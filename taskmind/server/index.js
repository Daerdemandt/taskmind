"use strict"

const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash/fp');
const uuid = require('uuid/v4');

const config = require('config');

const express = require('express');
const http = require('http');
const createError = require('http-errors');
const isProperHttpError = _.flow(_.prop('constructor.super_.name'), _.eq('HttpError'));

//process.env.NODE_ENV = 'production';
const env = process.env.NODE_ENV || 'dev';
const debug = env != 'production';
// Express uses middleware in order of .use's and short-circuits on .get's.
// Keep the helmet among the first ones and error-catching among the last ones
const app = express();
app.use((req, res, next) => {
	req.requestTime = Date.now();
	next();
})
app.use(require('helmet')()); // TODO: is it really necessary?
app.use(require('express-promise')());
const errorTimeout = config.get('errorTimeout') || 9000;
const setAppErrorHandler = () => debug ? null : app.use((err, req, res, next) => {
	console.log('Some error!');
	if (isProperHttpError(err)) return next(err);
	const timeElapsed = Date.now() - req.requestTime;
	const delay = (errorTimeout > timeElapsed) ? (errorTimeout - timeElapsed) : Math.random(errorTimeout);
	setTimeout(() => { // hinder timing attacks

		const id = uuid(); // don't show actual errors to the attacker
		console.error(`Error id: ${id}`)
		if (_.isString(err)) console.error(err);
		if (err.message) console.error(err.message);
		console.error(err.stack || "No stack trace available");

		res.status(500).send(`Something broke! Here's a secret number that will let us know what exactly: ${id}`)
	}, delay)
})


const server = http.createServer(app);

const mkdlog = (name) => (...args) => debug ? console.log(`[${name.toUpperCase()}]:`, ...args) : null;
const dlog = mkdlog('server');

const marcopolo = require('./marco.js')(config.get('responses'))

// TODO: make sure the name is the same as in logger
MongoClient.connect('mongodb://mongo:27017/messages').then((mongo) => {
	const eventLog = mongo.collection('messages');
	const responses = config.get('responses')
	dlog(responses)

	dlog('Mongo connected')

	app.get('/:endpoint', (req, res) => res.send(marcopolo(req.params.endpoint)
		.then(_.tap((result) => dlog(`Requested ${req.params.endpoint}, responding with ${result}, additional params ${JSON.stringify(req.query, null, '\t')}`) ))
	));
	setAppErrorHandler();
}).catch((error) => console.log('mongo error', error));

Promise.resolve()
	.then(() => console.log('Bringing up the server'))
	.then(() => new Promise((yay, nay) => server.listen(process.env.PORT || 80, (error) => !error ? yay() : nay(error))))
	.then(() => console.log('Server up'))
	.catch((error) => {
		console.log('Error:', error);
		process.exit(error);
	})
