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

import { combineReducers } from 'redux'
import * as actions from './actions'
var update = require('react-addons-update');

/***
 * Reduces the state of the settings
 * @param state:
 *  {} (default): Use default value for each setting
 *  {aSetting: true|false, ...}: Pass desired value of setting
 * @param action: actions.set3d, actions.setRelatedImages, etc
 * @returns {*}
 */
function settings(state = {}, action) {
    if (action.type)
        // whatever the type key is, update the state to given type/value
        return update(state, {
            $set: {[action.type] : action.value}
        });
    else
        return state
}

/***
 * Reduces the state of the models
 * @param state:
 *  {
 *      result: [],
 *      entities: {
 *          current: null,
 *          models: {}
 *      } 
 *  } (default): No model is loaded and no model has stored state
 *  {
 *   result: [known model keys],
 *   entities: {
 *      current: model key of the current model, 
 *      models: {
 *          model key: {
 *             status: on of actions.Statuses 
 *             scenes: see scenes reducer
 *          }
 *          ...
 *      }
 *   }
 *  }
 * @param action
 * @returns {*}
 */
function models(state = {result:[], entities: {current:null, models:{}}}, action) {
    switch (action.type) {
        // Registers a 3D model when discovered by modelKey in the DOM.
        // If a model is already registered nothing changes    
        case actions.REGISTER_MODEL:
            return state.result.includes[action.modelKey] ? state.result : update(state, {
                    // add the modelKey to the result array if not present
                    result: [
                        ...state.result,
                        action.modelKey
                    ],
                    // add a default model for the modelKey
                    entities: { 
                        models: {$merge: {[action.modelKey]: {
                            // default the status to the initial state.
                            status: actions.Statuses.INITIALIZED
                        }}
                    }}
                }
            )
        // Triggers loading of a model
        case actions.LOAD_MODEL:
            return update(state, {
                    // Update the model status to LOADING
                    entities: {
                        models: {$merge: {[action.modelKey]: {
                            // default the status to the initial state.
                            status: actions.Statuses.LOADING
                        }}
                    }}
                }
            )
        // Upon loading indicates the model is ready for interaction
        case actions.MODEL_LOADED:
            return update(state, {
                    // Update the model status to READY
                    entities: { 
                        models: {$merge: {[action.modelKey]: {
                            // default the status to the initial state.
                            status: actions.Statuses.READY
                        }}
                    }}
                }
            )
        // Upon load error makes the model unavailable for interaction with reload option
        case actions.MODEL_ERRED:
            return update(state, {
                    // Update the model status to READY
                    entities: { 
                        models: {$merge: {[action.modelKey]: {
                            // default the status to the initial state.
                            status: actions.Statuses.ERROR
                        }}}
                    }
                }
            )
        // Shows the given model by making it the current model
        case actions.SHOW_MODEL:
            return update(state, {
                // sets the current model
                entities: {
                    $set: {current: action.modelKey}
                }
            }
        )
        
        default:
            return state
    }
}

/***
 * Reduces the state of the scenes of a model
 * @param state
 *  {
 *      result: [],
 *      entities: {
 *          current: null,
 *          scenes: {}
 *      } 
 *  } (default): No scene is current and no scenes exist
 *  {
 *   result: [known scene keys],
 *   entities: {
 *      current: scene key of the current model, 
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
function scenes(state = {result:[], entities: {current:null, scenes:{}}}, action) {
    switch (action.type) {
        // Registers a 3D model when discovered by modelKey in the DOM.
        // If a model is already registered nothing changes    
        case actions.SHOW_SCENE:
            return update(state, {
                    // sets the current scene
                    scenes: {
                        $set: {current: action.sceneKey}
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

const amtrakApp = combineReducers({
    settings,
    models,
    scenes
})

export default amtrakApp