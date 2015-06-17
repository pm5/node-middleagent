'use strict'

function Request (req) {
  this._req = req
}

Request.prototype.header = function (name) {
}

module.exports = Request
