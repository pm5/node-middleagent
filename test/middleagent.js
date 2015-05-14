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
    agent.get('http://example.com', function* () {
      done()
    })
  })

  //it('can use middleware', function(done) {
    //agent.use(testHeader('foobar'))
      //.get('http://example.com', function* () {
        //done()
      //})
  //})
})
