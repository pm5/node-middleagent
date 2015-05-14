'use strict'

var co = require('co'),
    http = require('http')

function Agent () {
}

module.exports = function () {
  return new Agent()
}

Agent.prototype.use = function (mw) {
  return this
}

Agent.prototype.get = function (path, mw) {
  http.get(path, function (err, res) {
    co(function * () {
      yield mw
    })
  })
  return this
}
