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
const { SHOW_ALL } = VisibilityToggles
var update = require('react-addons-update');

/***
 * Reduces the state of the settings
 * @param state:
 *  {} (default): Use default value for each setting
 *  {aSetting: true|false, ...}: Pass desired value of setting
 * @param acton: actions.set3d, actions.setRelatedImages, etc
 * @returns {*}
 */
function settings(state = {}, action) {
    if (action.type)
        // whatever the type key is, update the state to given type/value
        return Object.assign({}, state, {
            [action.type] : action.value
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
 *          modelState: {}
 *      } 
 *  } (default): No model is loaded and no model has stored state
 *  {
 *   result: [known model keys],
 *   entities: {
 *      current: model key of the current model, 
 *      modelState: {
 *          model key: model state,
 *          model key: model state
 *          ...
 *      }
 *   }
 *  }
 * @param action
 * @returns {*}
 */
function models(state = {result:[], entities: {current:null, modelState:null}}, action) {
    switch (action.type) {
        case actions.REGISTER_MODEL:
            return update(state, {
                // add the modelKey to the result array if not present
                result: state.result.includes[action.modelKey] ? state.result : [
                    ...state.result,
                    action.modelKey
                ],
                // add a default modelState for the modelKey if not present
                entities : update(
                    state.entities, 
                    {[action.modelKey] : update({}, state.entities[action.modelKey] || {})}
                )
            }
        )
        case TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    })
                }
                return todo
            })
        default:
            return state
    }
}

const todoApp = combineReducers({
    visibilityFilter,
    todos
})

export default todoApp