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
      .then(function (context) {
        expect(context.response.header).to.be.ok
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
    var queue = []
    agent
      .use(function * (next) {
        debug('enter middleware 1')
        queue.push(1)
        yield next
        queue.push(1)
        debug('exit middleware 1')
      })
      .get('http://example.com', function * () {
        debug('enter middleware 2')
        queue.push(2)
        debug('exit middleware 2')
      })
      .then(function () {
        expect(queue).to.eql([1,2,1])
        done()
      })
      .catch(done)
  })

  it('can access request and response by context', function (done) {
    agent.use(function * (next) {
      expect(this.request.header).to.be.ok
      yield next
      expect(this.response.statusCode).to.equal(200)
    }).get('http://example.com')
    .then(done, done)
  })
})
