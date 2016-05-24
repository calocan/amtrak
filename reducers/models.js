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
 * Reduces the state of the models
 * @param state:
 *  {
 *      result: [],
 *      entities: {
 *          currentModelKey: null,
 *          models: {}
 *      }
 *  } (default): No model is loaded and no model has stored state
 *  {
 *   result: [known model keys],
 *   entities: {
 *      currentModelKey: model key of the current model,
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
function models(state = {result:[], entities: {currentModelKey:null, models:{}}}, action) {
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
                        $set: {currentModelKey: action.modelKey}
                    }
                }
            )

        default:
            return state
    }
}

export default models
