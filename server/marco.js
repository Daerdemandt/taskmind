"use strict"
//--------------------------------- 80 chars -----------------------------------
const _ = require('lodash/fp');
const defaultResponses = {marco: 'polo', ping: 'pong'}

module.exports = (responses = defaultResponses) => (request) => {
	const result = responses[request];
	return _.isUndefined(result) ? Promise.reject('Unknown prompt') : Promise.resolve(result)

}
