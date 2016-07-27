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
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import Iframe from './Iframe'
import Frame from './Frame'
import * as actions from '../actions/model'
import Statuses from '../statuses'

class Model3d extends Component {
    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    /***
     * As soon as the component mounts we want to show the closest 3d model to the scroll position of the
     * text. It could be any 3d model since the URL loaded might have an anchor
     */
    componentDidMount() {
        const { dispatch, url } = this.props
        if (this.refs.iframe)
            this.refs.iframe.getDOMNode().addEventListener('load', this.frameDidLoad);
    }
    
    componentDidUpdate() {
    }

    /***
     * Call the receive action when the frame loads
     * TODO this is firing too early. We need it to fire when the embedded model if fully loaded
     * We probably need to check the status of the 3d model network resource or tap into the js of the loader code
     * @param event
     */
    frameDidLoad(event) {
        this.props.receiveModel(this.props.modelKey)
        const sceneKey = this.currentSceneKey()
        // Once loaded change the scene if one is specified
        if (sceneKey)
            this.changeScene(sceneKey)
    }
    
    /***
     * Check for a prop change to model, if so fetch the model if needed. render will set the ifram to the model's url
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){

        // Not called for the initial render
        // Previous props can be accessed by this.props
        // Calling setState here does not trigger an an additional re-render
        const nextModelKey = nextProps.modelKey
        const modelChanged = this.props.modelKey != nextModelKey
        if (modelChanged)
            // Fetch the model, which currently just sets the url of the model's state so the iframe can load it
            this.props.fetchModelIfNeeded(nextModelKey)
        const sceneKey = this.currentSceneKey()
        const nextSceneKey = nextProps.model && nextProps.model.getIn(['scenes', 'current'])
        // If the model changed or the scene changed
        // and the next model has a READY status, we can also set the scene to the current scene calling
        // an action on the scene panel within the iframe. Otherwise we set the scene in frameDidLoad
        if (nextModelKey && nextSceneKey && 
            nextProps.model.get('status') == Statuses.READY && 
            (modelChanged || sceneKey != nextSceneKey)) {
            this.changeScene(nextSceneKey)    
        }
    }

    /***
     * Returns the current scene key of the current model
     */
    currentSceneKey() {
        return this.props.model && this.props.model.getIn(['scenes', 'current'])
    }

    /***
     * Changes the scene of the 3D model in the iframe to the scene with the given key
     * @param sceneKey
     */
    changeScene(sceneKey) {
        const dom = ReactDOM.findDOMNode(this).children['iframe']
        if (!dom)
            return
        const sceneDiv = dom.querySelectorAll(`div.viewer-scene-option[title="${sceneKey}"]`)[0]
        if (sceneDiv) {
            sceneDiv.click()
        }
    }

    /***
     * When no current scene is active or when the model first loads in the iframe, go to the first scene
     * TODO. Not sure if this is needed since a loaded model has a default camera view
     */
    firstScene() {
        document.querySelectorAll('div.viewer-scene-option')[0].click()
    }

    /***
     * Renders the model in an iframe. By setting the url we commence model loading here
     * @returns {XML}
     */
    render() {
        const settings = this.props.settings
        if (!settings)
            return <div/>
        const url = this.props.model && this.props.model.get('url')
        const key = this.props.model && this.props.model.get('key')

        const style = {
            zIndex: 0, // Below the document
            width: settings.get('modelWidth'),
            height: settings.get('modelHeight')
        }
        if (!url)
            return <div style={style}/>

        // Notice that we give the iframe the same width and height as the containing div
        const iframe = (
            <div style={style}>
                <Frame head={<head>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
                    <meta charset="utf-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
                    <title>3D Warehouse</title>
                    <script src="https://3dwarehouse.sketchup.com/js/lib/three.min.js"></script>
                    <script src="https://3dwarehouse.sketchup.com/js/lib/skjviewer.js"></script>
                    <script src="https://3dwarehouse.sketchup.com/js/startup_b56fb52.js"></script>
                    <link rel="stylesheet" href="https://3dwarehouse.sketchup.com/third-party/fa/css/font-awesome.min.css"/>
                    <link rel="stylesheet" href="https://3dwarehouse.sketchup.com/css/warehouse_b56fb52.css"/>
                    <script src="https://3dwarehouse.sketchup.com/js/lib/raven.min.js"></script>
                    <script src="https://3dwarehouse.sketchup.com/compiled_b56fb52.js"></script>
                    <script src="https://3dwarehouse.sketchup.com/js/maintenance.js?1469624340000"></script>
                    </head>}
                >
                    <div id="error-container"></div>
                    <div id="view-container">
                        <div id="view-cell" tabindex="0">
                            <div id="toolbar-event-stopper">
                                <div id="viewer-toolbar" class="viewer-toolbar">
                                    <div id="viewer-button-toggle" class="viewer-toolbar-button" title="Open the Toolbar"></div>
                                    <div id="viewer-button-zoom-extents" class="viewer-toolbar-button" title="Zoom Extents"></div>
                                    <div id="viewer-button-help" class="viewer-toolbar-button" title="WebGL Viewer Info"></div>
                                    <div id="viewer-button-views" class="viewer-toolbar-button" title="Open the Cameras Menu"></div>
                                </div>
                                <div id="viewer-button-full-screen" title="Enter Full Screen Mode" style="display: block;"></div>
                            </div>
                            <canvas id="skjWebGlCanvas" width="2540" height="1334" style="cursor: url(&quot;img/cursor-orbit.png&quot;) 23 23, default; width: 1270px; height: 667px;"></canvas>
                        </div>
                    </div>
                    <div id="progress" style="display: none;">
                        <img src="img/progress_bg_viewer.png" />
                        <img src="img/progress_animation.gif" />
                    </div>
                    <a id="watermark" title="View this model on 3D Warehouse" target="_blank" href="https://3dwarehouse.sketchup.com/model.html?id=2b495238-e77d-4edf-bb23-b186daf0640f" style="display: block; overflow: hidden;">
                        <img alt="3D Warehouse" src="https://3dwarehouse.sketchup.com/img/embed-watermark.png" style="margin-left: 0px; margin-top: 0px; width: 134px; height: 20px;"/>
                    </a>
                    <script>
                        var page = new frontend.EmbedPage();
                    </script>
                    <div class="butter-bar butter-bar-hidden">
                        <div id="butterbar-message-text"></div>
                    </div>
                </Frame>
            </div>)
            /*
            <Iframe
                src={url}
                name={`iframe_${key}`}
                onLoad={this.frameDidLoad.bind(this)}
                width={settings.get('modelWidth')}
                height={settings.get('modelHeight')}
            />
            </div> : <div style={style}/>
            
            */

        return iframe
    }
}
Model3d.propTypes = {
    model: PropTypes.object
}

function mapStateToProps(state) {
    const settings = state.get('settings')
    const documentKey = state.getIn(['models', 'current'])
    const models = documentKey && state.get('models')
    const modelKey = models && models.get('current')
    const model = modelKey && models.getIn(['entries', modelKey])
    return {
        settings,
        modelKey,
        model,
        models
    }
}

export default connect(
    mapStateToProps,
    actions
)(Model3d)
