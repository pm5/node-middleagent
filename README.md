Middleagent
===========

HTTP client for Node.js with Koa-like middleware interface

Usage
-----

Currently this is just a simple wrapper of Node.js `http` module with Koa-like middleware API and ES6 Promise:

```javascript
var agent = require('middleagent')

agent.use(function * (next) {
  // do something with this.request in the cascading
  yield next
  // do something with this.response in the cascading
}).get('http://example.com', function * () {
  // do something in the cascading
}).then(function (context) {
  // do something
}, function (err) {
  // handle errors
})
```

License
-------

[MIT license](http://pm5.mit-license.org/)
