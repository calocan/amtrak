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

/***
 * Document is the component container responsible for loading
 * and displaying a document from an external source (e.g. Google Docs)
 */

import React, { Component, PropTypes } from 'react'
import {registerModel} from "../actions";
import {fetchModelIfNeeded} from "../actions";

class Document extends Component {

    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    init() {
        gapi.client.setApiKey('AIzaSyCeVVoW3NbuoVrmW_pa5HtVSG2rxQyEDXs');
        gapi.client.load('drive', 'v3').then(makeRequest);
    }

    componentDidMount() {
        const { dispatch, url } = this.props
        // Hard-code the initial models and fetch them here, instead of relying on the user scroll.
        const initialModel = 'train'
        dispatch(registerModel(initialModel))
        dispatch(fetchModelIfNeeded(initialModel))
    }

    render() {
        return <div>
        </div>
    }
    
    loadDocument(url) {
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
    }

    //http://stackoverflow.com/questions/18537227/fetch-and-display-google-doc-body-within-html-page
    /***
     * Retrieves a the raw HTML of a Google Doc
     * @returns {*}
     */
    makeRequest() {
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
    }
}

Document.propTypes = {
    url: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    current: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {state.document}
    return {
        state: state
    };
    const Map({
        url,
        status,
        current
    }) = state.get('document')
}

export default connect(mapStateToProps)(Document)