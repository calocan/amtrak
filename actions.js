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

export const SET_3D = 'SET_3D'
export const SET_RELATED_IMAGES = 'SET_RELATED_IMAGES'

export const LOAD_MODEL = 'LOAD_MODEL'
export const SHOW_MODEL = 'SHOW_MODEL'
export const NEXT_MODEL = 'NEXT_MODEL'
export const PREVIOUS_MODEL = 'PREVIOUS_MODEL'
export const CURRENT_MODEL = 'CURRENT_MODEL'

export const SHOW_SCENE = 'SHOW_SCENE'
export const FREE_SCENE = 'FREE_SCENE'

/*
 * Other constants
*/

export const VisibilityToggle = {
}

/*
 * Action creators. 
 * List in the same order as the action types.
 */

/***
 * Sets the DOM to show interactive 3D models when supported.
 * 
 * @param to: 
 *  true (default): show 3D model
 *  false: show 2D still images of 3D models when 3D is unsupported or the user wants 2D
 * @returns {{type: string, bool: to}}
 */
export function set3d(to=true) {
    return { type: SET_3D, to }
}

/***
 * Shows images related to the current 3D model or its current scene.
 * 
 * @param to
 *  true (default): show images
 *  false: hide images
 * @returns {{type: string, bool: to}}
 */
export function setRelatedImages(to=true) {
    return { type: SET_RELATED_IMAGES, to }
}

/***
 * Loads the given unloaded 3D model into the browser
 * this does not show the model since we might want to background load several models
 * 
 * @param modelKey: The invariable key of the model (e.g. 'denver_train_station')
 * @returns {{type: string, modelKey: *}}
 */
export function loadModel(modelKey) {
    return { type: LOAD_MODEL, modelKey }
}

/***
 * Shows the given 3D model in the given 3D view
 *
 * @param modelKey: The invariable key of the 3D model (e.g. 'denver_train_station')
 * @returns {{type: string, modelKey: *}}
 */
export function showModel(modelKey) {
    return { type: SHOW_MODEL, modelKey }
}

/***
 * Advances to the next model by finding the DOM reference to the current 3D model
 * and seeking forward the first DOM reference to a 3D model
 *
 * @param currentModelKey:
 *  null (default): Assumes the current 3D model of the state
 *  otherwise: The invariable key of the 3D model from which to seek (e.g. 'denver_train_station')
 * @returns {{type: string, currentModelKey: *}}
 */
export function nextModel(currentModelKey=null) {
    return { type: NEXT_MODEL, currentModelKey }
}

/***
 * Retreats to the previous model by finding the DOM reference to the current 3D model
 * and seeking backward the first DOM reference to a 3D model
 * 
 * @param currentModelKey:
 *  null (default): Assumes the current 3D model of the state
 *  otherwise: The invariable key of the 3D model from which to retreat (e.g. 'denver_train_station')
 * @returns {{type: string, currentModelKey: *}}
 */
export function previousModel(currentModelKey=null) {
    return { type: PREVIOUS_MODEL, currentModelKey }
}

/***
 *
 * Returns the identity of the current 3D model
 * @returns {{type: string, currentModelKey: *}}
 */
export function currentModel() {
    return { type: CURRENT_MODEL }
}

/***
 * Sets the current 3D model to its closest scene based on the user's position in the DOM
 * if FREE_SCENE had been previously called, this relocks to a scene so that subsequent
 * movement by the user in the DOM will change scenes
 * 
 * @returns {{type: string, currentModelKey: *}}
 */
export function showScene() {
    return { type: SHOW_MODEL }
}
/***
 * Frees the current 3d model from changing scenes automatically, instead
 * remaining at the current scene or where the user manually positioned the model
 * 
 * @returns {{type: *, currentModelKey: *}}
 */
export function freeScene() {
    return { type: FREE_MODEL }
}

