/**
 * Created by Andy Likuski on 2016.05.24
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as actions from '../actions/index'
var update = require('react-addons-update');

/***
 * Reduces the state of the scenes of a model
 * @param state
 *  {
 *      result: [],
 *      entities: {
 *          currentSceneKey: null,
 *          scenes: {}
 *      } 
 *  } (default): No scene is current and no scenes exist
 *  {
 *   result: [known scene keys],
 *   entities: {
 *      currentSceneKey: scene key of the current model, 
 *      freed: default false, true if scenes should not change based on the users movement in the DOM
 *      scenes: {
 *          scene key: {
 *              nothing needed here yet
 *          }
 *          ...
 *      }
 *   }
 *  }
 * @param action
 */
function scenes(state = {result:[], entities: {currentSceneKey:null, scenes:{}}}, action) {
    switch (action.type) {
        // Registers a 3D model when discovered by modelKey in the DOM.
        // If a model is already registered nothing changes    
        case actions.SHOW_SCENE:
            return update(state, {
                    // sets the current scene
                    scenes: {
                        $set: {currentSceneKey: action.sceneKey}
                    }
                }
            )
        case actions.FREE_SCENE:
            return update(state, {
                    // toggles the model between automatic scene changing (false)
                    // and staying the at the current scene or camera view that the user has positioned.
                    entities: {
                        $set: {freed: !state.entities.freed}
                    }
                }
            )
        default:
            return state
    }
}

export default scenes
