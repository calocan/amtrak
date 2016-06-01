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

import {List, Map} from 'immutable';
import {SET_STATE} from '../actions/article'
import * as actions from '../actions/model'

/***
 * Reduces the state of the models
 * @param state:
 *  {
 *      keys: [],
 *      current: null,
 *      baseUrl: null,
 *      entries: {
 *      }
 *  } (default): No model is loaded and no model has stored state
 *  {
 *   keys: [known model keys],
 *   current: model key of the current model,
 *   baseUrl: base url of the models, the key completes the url
 *   entries: {
 *      model key: {
 *         status: on of actions.Statuses
 *         scenes: see scenes reducer
 *         url: the url of the model, formed by combining the key with a base url
 *      }
 *      ...
 *   }
 * }
 * @param action
 * @returns {*}
 */
function models(state = Map({keys: List(), current: null, entries: Map({})}), action) {
    switch (action.type) {
        // If setting state
        case SET_STATE:
            return state.merge(action.state.get('models'));
        
        // Registers a 3D model when discovered by model key in the DOM.
        // If a model is already registered nothing changes
        case actions.REGISTER_MODEL:
            return (!state.get('keys').has(action.key)) ?
                state
                    // add the model key to the result array
                    .updateIn(['keys'], list=>list.push(action.key))
                    // merge the entry into the entries
                    .mergeDeep({entries: { 
                        [action.key] : {
                            // status is initialized, nothing is loaded yet
                            status: actions.Statuses.INITIALIZED,
                            // Full url combines the baseUrl with the key
                            url: state.get('baseUrl') + state.get('key')
                        }}}):
                        state;
        // Triggers loading of a model
        case actions.LOAD_MODEL:
            return state.setIn(['entries', action.key, 'status'], actions.Statuses.LOADING);
        // Upon loading indicates the model is ready for interaction
        case actions.RECIEVE_MODEL:
            return state.setIn(['entries', action.key, 'status'], actions.Statuses.READY);
        // Upon load error makes the model unavailable for interaction with reload option
        case actions.MODEL_ERRED:
            return state.setIn(['entries', action.key, 'status'], actions.Statuses.ERROR);
        // Shows the given model by making it the current model
        case actions.SHOW_MODEL:
            return state.set('current', action.key);
        // Sets the current scene of the model
        case actions.SHOW_SCENE:
            return state.setIn(['entries', action.modelKey, 'scenes', 'current'], action.key);
        // If action.value is true, marks the scenes of the model freed from automatic changing when the user moves the text
        case actions.FREE_SCENE:
            return state.setIn(['entries', action.modelKey, 'scenes', 'freed'], action.value);
        default:
            return state
    }
}

export default models
