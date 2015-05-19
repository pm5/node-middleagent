'use strict'

var co = require('co'),
    http = require('http'),
    debug = require('debug')('middleagent')

function Agent () {
  this._mw = []
}

module.exports = function () {
  return new Agent()
}

Agent.prototype.use = function (mw) {
  this._mw.push(mw)
  return this
}

Agent.prototype.get = function (path, mw) {
  var that = this
  this.use(mw)
  return new Promise(function (resolve, reject) {
    http.get(path, function (res) {
      return resolve(res)
    })
    .on('error', function (err) {
      debug('http error')
      return reject(err)
    })
  }).then(function (res) {
    var m = that._mw.map((w, i, arr) => w(arr.length === i + 1 ? null : arr[i + 1]))
    return co(function * () {
      m[0].next()
    })
  })
}
