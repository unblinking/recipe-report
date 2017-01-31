<a name="routes"></a>

# routes : <code>object</code>
Define application end points (routes) for the Grocereport API and how they respond to client requests.

**Kind**: global namespace  
**Access:** public  
**Author:** jmg1138 [jmg1138 on GitHub](https://github.com/jmg1138)  
**Copyright**: nothingworksright [nothingworksright on GitHub](https://github.com/nothingworksright)  

* [routes](#routes) : <code>object</code>
    * [.router](#routes.router) : <code>object</code>
        * [..app.get(req, res)](#routes.router.app.get(/))
        * [..app.get(req, res)](#routes.router.app.get(/test))
        * [..app.post(req, res)](#routes.router.app.post)

<a name="routes.router"></a>

## routes.router : <code>object</code>
**Kind**: static namespace of <code>[routes](#routes)</code>  
**Access:** public  
**See**

- [Express routing](https://expressjs.com/en/guide/routing.html)
- [Express API](http://expressjs.com/en/api.html)


| Param | Type | Description |
| --- | --- | --- |
| app | <code>object</code> | The Express application instance. |


* [.router](#routes.router) : <code>object</code>
    * [..app.get(req, res)](#routes.router.app.get(/))
    * [..app.get(req, res)](#routes.router.app.get(/test))
    * [..app.post(req, res)](#routes.router.app.post)

<a name="routes.router.app.get(/)"></a>

### router..app.get(req, res)
GET request to the root route. Responds with the JSON object { message: "hello" }

**Kind**: static method of <code>[router](#routes.router)</code>  
**Access:** public  
**See**: [Express API](https://expressjs.com/en/api.html)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | The HTTP request. |
| res | <code>object</code> | The HTTP response. |

**Example**  
```js
// Responds with the JSON object { message: "hello" }var request = require('request');request('http://www.grocereport.com/',    function(err, res, body) {        if (!err && res.statusCode == 200) {            console.log(body);        }    });
```
<a name="routes.router.app.get(/test)"></a>

### router..app.get(req, res)
GET request to the /test route. Responds with the JSON object { message: "Welcome to the team, DZ-015" }

**Kind**: static method of <code>[router](#routes.router)</code>  
**Access:** public  
**See**: [Express API](https://expressjs.com/en/api.html)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | The HTTP request. |
| res | <code>object</code> | The HTTP response. |

**Example**  
```js
// Responds with the JSON object { message: "Welcome to the team, DZ-015" }var request = require('request');request('http://www.grocereport.com/test',    function(err, res, body) {        if (!err && res.statusCode == 200) {            console.log(body);        }    });
```
<a name="routes.router.app.post"></a>

### router..app.post(req, res)
**Kind**: static method of <code>[router](#routes.router)</code>  
**Summary**: POST request to the login route. Sends a response of 'Thank you' when a POST request is made to the login route.  
**Access:** public  
**See**: [Express API](https://expressjs.com/en/api.html)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | The HTTP request. |
| res | <code>object</code> | The HTTP response. |

**Example**  
```js
var request = require('request');var options = {    url: 'http://grocereport.com/login',    json: {        name: 'Joshua'    },};request.post(options, function(err, res, body) {    console.log(body);});
```
