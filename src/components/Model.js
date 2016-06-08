/**
 * Created by Andy Likuski on 2016.06.01
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component, PropTypes } from 'react'
import {Map} from 'immutable'
import {connect} from 'react-redux';
import Iframe from './Iframe'

class Model extends Component {
    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, url } = this.props
        // Hard-code the initial models and doFetch them here, instead of relying on the user scroll.
        const initialModel = 'train'
        //dispatch(showModel(initialModel))
        if (this.refs.iframe)
            this.refs.iframe.getDOMNode().addEventListener('load', this.frameDidLoad);
    }
    componentDidUpdate() {
    }
    

    frameDidLoad(event) {
        console.log('loaded the iframe') 
    }

    render() {
        const url = this.props.model && this.props.model.get('url')
        const models = this.props.models
        const style = {position: 'fixed', top: '20px', zIndex: 0, width: 500, height: 500}
        const iframe = url ? <div style={style}>  
            <Iframe
                src={url}
                onLoad={this.frameDidLoad.bind(this)}
                width={models && models.get('width')}
                height={models && models.get('height')}
            />
            </div> : <div style={style}/>

        return iframe
    }
}
Model.propTypes = {
    model: PropTypes.object
}

function mapStateToProps(state) {
    const documentKey = state.getIn(['models', 'current'])
    const models = documentKey && state.get('models')
    const modelKey = models && models.get('current')
    const model = modelKey && models.getIn(['entries', modelKey])
    // The closest anchor to the scroll position. Used to determine the current model and scene
    const closestAnchor = state.getIn(['documents', 'closestAnchor'])
    return {
        model,
        models,
        closestAnchor
    }
}

export default connect(mapStateToProps)(Model)
