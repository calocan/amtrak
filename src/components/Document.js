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
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import {Map} from 'immutable'
import * as actions from '../actions/document'
import * as siteActions from '../actions/site'

class Document extends Component {

    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }


    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.indexAnchors()
    }

    componentDidUpdate() {
        this.indexAnchors()
    }

    /***
     * Finds all the anchors that anchor models and scenes.
     * Sends an update to the state with the info.
     */
    indexAnchors() {
        const dom = ReactDOM.findDOMNode(this)
        // Send the registerAnchors action to put the anchors in the state
        // This allows us to find the closest anchor based on what handleScroll reports
        // Spread operator converts the resulting NodeList to an Array
        this.props.registerAnchors([...dom.querySelectorAll('a[id]')])
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    /***
     * Whenever the scrollTop changes send an action so we can recalculate the closest anchor tag to the scroll
     * position
     * @param event
     */
    handleScroll(event) {
        let scrollTop = event.srcElement.body.scrollTop
        // Tell the reducers the scroll position so that they can determine what model and scene
        // are current
        this.props.registerScrollPosition(scrollTop)
    }
    
    /***
     * Check for a propc change to document.closestAnchor, and inform the Showcase if it changes
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){
        // Not called for the initial render
        // Previous props can be accessed by this.props
        // Calling setState here does not trigger an an additional re-render
        const closestAnchor = nextProps.document.get('closestAnchor')
        if (this.props.document.get('closestAnchor') != closestAnchor) 
            this.props.documentTellModelAnchorChanged(closestAnchor)
    }
    /***
     * When the closes anchor tag changes send a message
     */
    handleClosestAnchorChange() {

    }
    
    render() {
        return <div style={{marginLeft: '500px', zIndex: 1000}} dangerouslySetInnerHTML={{__html: this.props.document.getIn(['content', 'body'])}}></div>
    }
}

Document.propTypes = {
    document: PropTypes.object
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

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the actions so that the component can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(actions, siteActions)
)(Document)