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


/*
 * Action types. See action definition for explanation
*/

// Loads the document (formatted text)
export const LOAD_DOCUMENT = 'LOAD_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'

// sets the full state to a stored value (e.g. from a cookie)
export const SET_STATE = 'SET_STATE'

// settings actions
export const SET_3D = 'SET_3D'
export const SET_RELATED_IMAGES = 'SET_RELATED_IMAGES'

// model actions
export const REGISTER_MODEL = 'REGISTER_MODEL'
export const LOAD_MODEL = 'LOAD_MODEL'
export const MODEL_LOADED = 'MODEL_LOADED'
export const MODEL_ERRED = 'MODEL_ERRED'
export const SHOW_MODEL = 'SHOW_MODEL'
export const CURRENT_MODEL = 'CURRENT_MODEL'

// scene actions
export const SHOW_SCENE = 'SHOW_SCENE'
export const FREE_SCENE = 'FREE_SCENE'

/*
 * Other constants. TODO delete this if I have not other constants
*/

/***
 * The following status indicate the load state of the app
 * @type {{INITIALIZED: number, LOADING: number, READY: number, ERROR: number}}
 */
export const Statuses = {
    // Unloaded state
    INITIALIZED: 0x0100,
    // Loading state
    LOADING: 0x0800,
    // Loaded and ready for interaction
    READY: 0x02000,
    // Error loading
    ERROR: 0x1000
}

/*
 * Action creators. 
 * List in the same order as the action types.
 */

export function loadDocument(url) {
    return {
        type: LOAD_DOCUMENT,
        url
    }
}

export function receiveDocument(url, json) {
    return {
        type: RECEIVE_DOCUMENT,
        url,
        content: json.data,
        receivedAt: Date.now()
    }
}

// settings actions

/***
 * Sets the DOM to show interactive 3D models when supported.
 * 
 * @param value: 
 *  true (default): show 3D model
 *  false: show 2D still images of 3D models when 3D is unsupported or the user wants 2D
 * @returns {{type: string, bool: value}}
 */
export function set3d(value=true) {
    return { type: SET_3D, value }
}

/***
 * Shows images related to the current 3D model or its current scene.
 * 
 * @param value
 *  true (default): show images
 *  false: hide images
 * @returns {{type: string, bool: value}}
 */
export function setRelatedImages(value=true) {
    return { type: SET_RELATED_IMAGES, value }
}

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
export function modelLoaded(key) {
    return { type: MODEL_LOADED, key }
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

