'use strict'

var co = require('co'),
    http = require('http'),
    debug = require('debug')('middleagent:core')

var Request = require('./request'),
    Response = require('./response')

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
  var context = this
  if (mw) this.use(mw)
  return new Promise(function (resolve, reject) {
    var req = http.get(path, function (res) {
      context.response = new Response(res)
      return resolve(res)
    })
    .on('error', function (err) {
      debug('http error: %s', err)
      return reject(err)
    })
    context.request = new Request(req)
  }).then(function (res) {
    if (context._mw.length == 0) return res
    var m = context._mw.map((w, i, arr) => w.apply(context, arr.length === i + 1 ? null : arr[i + 1]))
    return co(function * () {
      m[0].next()
    })
  })
}
