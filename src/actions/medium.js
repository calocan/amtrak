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
 * Defines the all actions of the application used manipulate the DOM.
 */

import fetch from 'isomorphic-fetch'
import ActionLoader from '../actionLoader'

/*
 * Action types. See action definition for explanation
*/

// medium actions
export const REGISTER_MEDIUM = 'REGISTER_MEDIUM'
export const LOAD_MEDIUM = 'LOAD_MEDIUM'
export const RECEIVE_MEDIUM = 'RECEIVE_MEDIUM'
export const MEDIUM_ERRED = 'MEDIUM_ERRED'
export const SHOW_MEDIUM = 'SHOW_MEDIUM'
export const SELECTED_MEDIUM = 'SELECTED_MEDIUM'

/*
 * Action creators. 
 * List in the same order as the action types.
 */

// medium actions

/***
 * Register the given unloaded medium when encountered in the DOM.
 * This does not load the medium since we might want to skip, queue or otherwise delay loading
 *
 * @param key: The invariable key of the medium (e.g. 'denver_train_station_exterior')
 * @returns {{type: string, key: *}}
 */
export function registerMedium(key) {
    return { type: REGISTER_MEDIUM, key }
}

/***
 * Loads the given unloaded 3D medium into the browser
 * this does not show the medium since we might want to background load several models
 *
 * @param key: The invariable key of the medium (e.g. 'denver_train_station_exterior')
 * @returns {{type: string, key: *}}
 */
export function loadMedium(key) {
    return { type: LOAD_MEDIUM, key }
}

/***
 * Receives the given unloaded medium from a remote source
 *
 * @param key: The invariable key of the model (e.g. 'denver_train_station')
 * @returns {{type: string, key: *}}
 */
export function receiveMedium(key) {
    return { type: RECEIVE_MEDIUM, key }
}

/***
 * Loads the given unloaded 3D model into the browser
 * this does not show the model since we might want to background load several models
 *
 * @param key: The invariable key of the model (e.g. 'denver_train_station')
 * @returns {{type: string, key: *}}
 */
export function mediumErred(key) {
    return { type: MEDIUM_ERRED, key }
}

// Use an ActionLoader to remotely load models
export const mediumLoader = ActionLoader({
    key:'media',
    register:registerMedium,
    load:loadMedium,
    receive:receiveMedium,
    erred:mediumErred
})