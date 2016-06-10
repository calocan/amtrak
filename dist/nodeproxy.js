/**
 * Created by Andy Likuski on 2016.06.09
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//
// How to use:
//
// 1. Start node:
//    node nodeproxy.js
// 2. Send a URL like this:
//    http://localhost:8080/http://www.google.com
//
// Watch www.google.com come through your local HTTP proxy.
//
// What is this useful for?
// Cross-domain Ajax requests can be rewritten so that they are routed through the local proxy, this can be easily
// done in your JS code by wrapping them in a function that checks if we're developing locally and if so include
// http://localhost:8080 in front of the URL. You can also extend the prototype of the String class:
//
//  String.prototype. = function() {
//    if(runningLocally) {
//      return("http://localhost:8080" + this);
//    }
//     else {
//      return(this);  
//    }
//  }
//
//  ...
//  $.ajax("http://yoursevice/ajax/request".prx, ...)
//

var http = require('http'),
    url = require('url');

http.createServer(function(request, response) {
    target = request.url;

    if(target[0] == "/") // remove the leading forward slash
        target = target.substring(1, target.length);

    console.log("Request received. Target: " + target);

    // parse the url
    url_parts = url.parse(target);
    if(url_parts.host == undefined) { // stop processing, URL must contain http(s)://
        response.write("ERROR: missing host in target URL " + target);
        response.end();
    }
    else {

        var proxy = http.createClient(80, url_parts.host)
        var proxy_request = proxy.request(request.method, url_parts.href, request.headers);

        console.log("Creating proxy request to server: " + url_parts.hostname + ", path: " + url_parts.pathname);
        proxy_request.addListener('response', function (proxy_response) {
            proxy_response.addListener('data', function(chunk) {
                response.write(chunk, 'binary');
            });
            proxy_response.addListener('end', function() {
                response.end();
            });
            response.writeHead(proxy_response.statusCode, proxy_response.headers);
        });
        request.addListener('data', function(chunk) {
            proxy_request.write(chunk, 'binary');
        });
        request.addListener('end', function() {
            proxy_request.end();
        });
    }
}).listen(8888);
console.log("Proxy started. Listening to port 8888");