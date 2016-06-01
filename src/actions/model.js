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

// model actions
export const REGISTER_MODEL = 'REGISTER_MODEL'
export const LOAD_MODEL = 'LOAD_MODEL'
export const RECIEVE_MODEL = 'RECIEVE_MODEL'
export const MODEL_ERRED = 'MODEL_ERRED'
export const SHOW_MODEL = 'SHOW_MODEL'
export const CURRENT_MODEL = 'CURRENT_MODEL'

// scene actions
export const SHOW_SCENE = 'SHOW_SCENE'
export const FREE_SCENE = 'FREE_SCENE'

/*
 * Action creators. 
 * List in the same order as the action types.
 */

// model actions

/***
 * Register the given unloaded 3D model when encountered in the DOM.
 * This does not load the 3D model since we might want to skip, queue or otherwise delay loading
 *
 * @param key: The invariable key of the model (e.g. 'denver_train_station')
 * @returns {{type: string, key: *}}
 */
export function registerModel(key) {
    return { type: REGISTER_MODEL, key }
}

/***
 * Loads the given unloaded 3D model into the browser
 * this does not show the model since we might want to background load several models
 * 
 * @param key: The invariable key of the model (e.g. 'denver_train_station')
 * @returns {{type: string, key: *}}
 */
export function loadModel(key) {
    return { type: LOAD_MODEL, key }
}

/***
 * Loads the given unloaded 3D model into the browser
 * this does not show the model since we might want to background load several models
 *
 * @param key: The invariable key of the model (e.g. 'denver_train_station')
 * @returns {{type: string, key: *}}
 */
export function receiveModel(key, json) {
    return { type: RECIEVE_MODEL, key }
}

/***
 * Loads the given unloaded 3D model into the browser
 * this does not show the model since we might want to background load several models
 *
 * @param key: The invariable key of the model (e.g. 'denver_train_station')
 * @returns {{type: string, key: *}}
 */
export function modelErred(key) {
    return { type: MODEL_ERRED, key }
}

// Use an ActionLoader to remotely load models
export const modelLoader = ActionLoader({
    key:'models', 
    register:registerModel,
    load:loadModel,
    receive:receiveModel,
    erred:modelErred
});

/***
 * Shows the given 3D model in the given 3D view
 *
 * @param key: The invariable key of the 3D model (e.g. 'denver_train_station')
 * @returns {{type: string, key: *}}
 */
export function showModel(key) {
    return { type: SHOW_MODEL, key }
}

// scene actions

/***
 * Sets the current 3D model to its closest scene based on the user's position in the DOM
 * if FREE_SCENE had been previously called, this relocks to a scene so that subsequent
 * movement by the user in the DOM will change scenes
 *
 * @param model: The model key
 * @param key: The invariable key of a model's scene (e.g. 'elephant_in_the_room')
 * @returns {{type: string, current: *}}
 */
export function showScene(modelKey, key) {
    return { type: SHOW_SCENE, key }
}

/***
 * Frees the current 3d model from changing scenes automatically, instead
 * remaining at the current scene or where the user manually positioned the model
 * @param model: The model key
 * @returns {{type: *, current: *}}
 */
export function freeScene(modelKey) {
    return { type: FREE_SCENE }
}
