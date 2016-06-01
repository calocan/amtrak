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
export const RECIEVE_MODEL = 'RECIEVE_MODEL'
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

/***
 * Indicates that the document is loading
 * @param url: The url of the document (e.g. a Google Docs url)
 * @returns {{type: string, url: *}}
 */
export function loadDocument(url) {
    return {
        type: LOAD_DOCUMENT,
        url
    }
}

/***
 * Indicates that the document is being received
 * @param url: The url of the document 
 * @param json: The json of the document
 * @returns {{type: string, url: *, content: *, receivedAt: number}}
 */
export function receiveDocument(url, json) {
    return {
        type: RECEIVE_DOCUMENT,
        url,
        content: json.data,
        receivedAt: Date.now()
    }
}

/***
 * This asynchronous action loads the docuement from its source (e.g. Google Drive)
 * @param url
 * @returns {Function}
 */
export function fetchDocument(url) {
    
    // Thunk middleware knows how to handle functions.
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.

    return function (dispatch) {

        // First dispatch: the app state is updated to inform
        // that the API call is starting.
        dispatch(loadDocument(url));

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.
        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
        return fetch(url).then(response => response.json())
            .then(json =>
                // Here, we update the app state with the results of the API call.
                dispatch(receiveDocument(subreddit, json))
            )

        // In a real world app, you also want to
        // catch any error in the network call.
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
 * Checks to see if model of the given key needs to be fetched from the server
 * @param state
 * @param key
 * @returns {*}
 */
function shouldFetchModel(state, key) {
    const entry = state.getIn(['models', 'entries', key]);
    // Only return true if the model is registered but not already loading or loaded
    // TODO we could try loading here if there is an error status
    return (entry.get('status') === Statuses.INITIALIZED);
}

/***
 * Fetches the model of the given key if it hasn't been loaded yet
 * @param key
 * @returns {function()}
 */
export function fetchModelIfNeeded(key) {

    // Note that the function also receives getState()
    // which lets you choose what to dispatch next.

    // This is useful for avoiding a network request if
    // a cached value is already available.

    return (dispatch, getState) => {
        if (shouldFetchModel(getState(), key)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchModel(key))
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}

/***
 * This asynchronous action loads a model from its source (e.g. Sketchup 3D Warehouse)
 * @param key: The key of the model to load.
 * @returns {Function}
 */
export function fetchModel(key) {

    return function (dispatch) {

        // First dispatch: the app state is updated to inform
        // that the API call is starting.
        dispatch(loadModel(key));

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.
        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
        return fetch('http://3dwarehouseurl.blah/'+key)
            .then(response => response.json())
            .then(json =>
                // Here, we update the app state with the results of the API call.
                dispatch(receiveModel(subreddit, json))
            )
        // In a real world app, you also want to
        // catch any error in the network call.
    }
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
export function receiveModel(key) {
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

