/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react'

export default React.createClass({
    /***
     * The link to the document that shall form the text of the article
     * @returns {*|Array}
     */
    getUrl: function() {
        return this.props.url || [];
    },

    loadDocument: function(url) {
        // Construct `fetch` params object
        var params = {
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
        return responseText
    },

    //http://stackoverflow.com/questions/18537227/fetch-and-display-google-doc-body-within-html-page
    /***
     * Retrieves a the raw HTML of a Google Doc
     * @returns {*}
     */
    makeRequest: function() {
        var request = gapi.client.drive.files.export({
            'fileId': '1L5XSb0mR4VrVagQLRkvdg9aSMjRgWdq0L6d7TK8Vslo',
            'mimeType': 'text/plain'
        });

        request.then(function(response) {
            console.log(response);
        }, function(err) {
            console.log('Error');
            console.log(err.result.error);
        });
    },

    init:function() {
        gapi.client.setApiKey('AIzaSyCeVVoW3NbuoVrmW_pa5HtVSG2rxQyEDXs');
        gapi.client.load('drive', 'v3').then(makeRequest);
    },

    const mapStateToProps = (state, ownProps) => {
        return {
            modelKey: state.entities.currentModelKey,
            sceneKey: state.entities.currentModelKey &&
            state.entities.models[state.entities.currentModelKey].currentSceneKey
        }
    }


    render: function() {
        return <div>
            <Header />
            <Showcase />
            <Document url={this.getUrl()} />
            <Footer />
        </div>;
    }
});