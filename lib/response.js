'use strict'

function Response (res) {
  this._res = res
}

Response.prototype.header = function (name) {
}

Response.prototype.statusCode = function () {
  return this._res.statusCode
}

module.exports = Response
