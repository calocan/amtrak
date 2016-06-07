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
 * and displaying a documents from an external source (e.g. Google Docs)
 */

import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';
import {Map} from 'immutable'

class Document extends Component {

    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    render() {
        return <div style={{marginLeft: '500px', zIndex: 1000}} dangerouslySetInnerHTML={{__html: this.props.document.getIn(['content', 'body'])}}></div>
    }
}

Document.propTypes = {
    documents: PropTypes.array
}

/***
 * Map the state, which is our list of documents, to the current document
 * @param state
 * @returns {{documents: *}}
 */
function mapStateToProps(state) {
    var currentDocumentKey = state.getIn(['documents', 'current'])
    return {
        document: currentDocumentKey ? state.getIn(['documents', 'entries', currentDocumentKey]) : Map({})
    }
}

export default connect(mapStateToProps)(Document)