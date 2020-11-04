"use strict"
//--------------------------------- 80 chars -----------------------------------

const _ = require('lodash/fp')
const wait = (delay) => new Promise((yay, nay) => setTimeout(yay, delay))

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();


const responses = {a: 'b', c: 'd'}
const marcopolo = require('../marco.js')(responses);

describe('marco', () => {
	it('Resolves with provided responses', () => {
		const test = ([req, res]) => marcopolo(req).should.eventually.equal(res);
		return Promise.all(_.toPairs(responses).map(test))
	})
	it('Rejects for unknown prompts', () => {
		return marcopolo('e').should.eventually.be.rejected
	})
})

