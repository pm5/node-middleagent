'use strict'

var middleagent = require('../')
var expect = require('chai').expect

function testHeader(testString) {
  return function* (next) {
    this.req.header('X-Test', testString)
    yield* next
  }
}

describe('Middleagent', function () {
  var agent

  beforeEach(function() {
    agent = middleagent()
  })

  it('can do HTTP GET', function (done) {
    agent.get('http://example.com', function * () {
      done()
    }).catch(done)
  })

  it('can throw error in middleware', function (done) {
    agent.get('http://example.com', function * () {
      throw 'I am an error!!!'
    }).catch(function (err) {
      expect(err).to.equal('I am an error!!!')
    }).then(done, done)
  })

  it('can catch error from http', function (done) {
    agent.get('http://barbapapa.garbodigu')
      .catch(function (err) {
        expect(err).to.be.ok
      })
      .then(done, done)
  })

  it('can use middleware', function(done) {
    var runned = false,
        got = false
    agent
      .use(function * (next) {
        runned = true
        yield next
        expect(got).to.be.true
      })
      .get('http://example.com', function * () {
        expect(runned).to.be.true
        got = true
      })
      .then(done, done)
  })
})
