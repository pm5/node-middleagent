'use strict'

var middleagent = require('../')
var expect = require('chai').expect,
    debug = require('debug')('middleagent:test')

describe('Middleagent', function () {
  var agent

  beforeEach(function () {
    agent = middleagent()
  })

  it('can do HTTP GET', function (done) {
    agent.get('http://example.com', function * () {
      done()
    }).catch(done)
  })

  it('can give promise', function (done) {
    agent.get('http://example.com')
      .then(function (res) {
        expect(res.headers).to.be.ok
      })
      .then(done, done)
  })

  it('can throw error in middleware', function (done) {
    agent.get('http://example.com', function * () {
      throw new Error('I am an error!!!')
    }).catch(function (err) {
      expect(err.toString()).to.equal('Error: I am an error!!!')
    }).then(done, done)
  })

  it('can catch error from http', function (done) {
    agent.get('http://barbapapa.garbodigu')
      .catch(function (err) {
        expect(err).to.be.ok
      })
      .then(done, done)
  })

  it('can use middleware', function (done) {
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

  it('can access request and response by context', function (done) {
    agent.use(function * (next) {
      expect(this.request.end).to.be.ok
      yield next
      expect(this.response.statusCode).to.equal(200)
    }).get('http://example.com')
    .then(done, done)
  })
})
