'use strict'

var co = require('co'),
    http = require('http'),
    debug = require('debug')('middleagent')

function Agent () {
}

module.exports = function () {
  return new Agent()
}

Agent.prototype.use = function (mw) {
  return this
}

Agent.prototype.get = function (path, mw) {
  return new Promise(function (resolve, reject) {
    http.get(path, function (res) {
      return resolve(res)
    })
    .on('error', function (err) {
      debug('http error')
      return reject(err)
    })
  }).then(function (res) {
    return co(function * () {
      yield mw
    })
  })
}
