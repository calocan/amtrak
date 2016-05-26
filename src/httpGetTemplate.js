/**
 * Created by Andy Likuski on 2016.05.26
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * httpGetTemplate.gs
 *
 * A pair of template functions for external host communication with
 * UrlFetchApp, including parameter encoding and error handling.
 *
 * From: gist.github.com/mogsdad/a76c32231a2b91ff8b59
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Template function for performing HTTP GET, with error handling.
 *
 * From: gist.github.com/mogsdad/a76c32231a2b91ff8b59
 */
function httpGetTemplate(apiId, apiParams) {
    // URL for target web API
    var url = 'https://.com/apis/' + apiId;

    // For GET method, API parameters will be sent in the URL.
    // Start with an object containing name / value tuples.
    var apiParams = {
        // Relevant parameters would go here
        'param1' : 'value1',
        'param2' : 'value2'   // etc.
    };

    // For GET, Encode params object as a URI escaped query string
    var encParams = toHtmlQuery_(apiParams);

    // Construct `fetch` params object
    var params = {
        'method': 'GET',              // This is redundant; GET is default
        'muteHttpExceptions' : true
    };

    var response = UrlFetchApp.fetch(url+encParams, params)

    // Check return code embedded in response.
    var rc = response.getResponseCode();
    var responseText = response.getContentText();
    if (rc !== 200) {
        // Log HTTP Error
        Logger.log("Response (%s) %s",
            rc,
            responseText );
        // Could throw an exception yourself, if appropriate
    }
    else {
        // Successful POST, handle response normally
        Logger.log( responseText );
    }
}

/**
 * Template function for performing HTTP POST, with error handling.
 *
 * From: gist.github.com/mogsdad/a76c32231a2b91ff8b59
 */
function httpPostTemplate() {
    // URL for target web API
    var url = 'https://example.com/apis/--apiId--';

    // For POST method, API parameters will be sent in the
    // HTTP message payload.
    // Start with an object containing name / value tuples.
    var apiParams = {
        // Relevant parameters would go here
        'param1' : 'value1',
        'param2' : 'value2'   // etc.
    };

    // All 'application/json' content goes as a JSON string.
    var payload = JSON.stringify(apiParams);

    // Construct `fetch` params object
    var params = {
        'method': 'POST',
        'contentType': 'application/json',
        'payload': payload,
        'muteHttpExceptions' : true
    };

    var response = UrlFetchApp.fetch(url, params)

    // Check return code embedded in response.
    var rc = response.getResponseCode();
    var responseText = response.getContentText();
    if (rc !== 200) {
        // Log HTTP Error
        Logger.log("Response (%s) %s",
            rc,
            responseText );
        // Could throw an exception yourself, if appropriate
    }
    else {
        // Successful POST, handle response normally
        Logger.log( responseText );
    }
}

/**
 * Generate HTML query string from given object
 * Adapted from http://stackoverflow.com/a/18116302/1677912
 */
function toHtmlQuery_(obj) {return "?"+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')};