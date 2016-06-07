import Statuses from "./statuses";
import fetch from 'isomorphic-fetch'

/**
 * Created by Andy Likuski on 2016.06.01
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/***
 * Performs the common sequence of actions of loading something from a remote source.
 * The class is given the following action functions: register, load, receive, erred for
 * the object being handled. It is also given a key into the state to find the substate
 * for the object instances. It's assumed that the state is in the form: 
 * {key: { entries: [{status:load status}] }
 */
export default class ActionLoader {

    // Abstract actions. Implement in subclass
    loadIt(url) {}
    receive(url, json) {}
    erred(url) {}

    /***
     * Describes how to make the url with the given entry
     * This will typically be overridden in the subclass
     * @param entry
     */
    makeLoadUrl(state, entry) {
        // This will normally need overriding
        return state.get('baseUrl')+entry.get('key')
    }

    /***
     * Constructs an ActionLoader with the various action functions needed to fully load
     * something. We also provide a key in the props that indicates how to find the substate
     * relative to the thing we are loading
     * @param props
     */
    constructor(props) {
    }
    
    /***
     * Returns the substate representing the container of the thing we are loading.
     * For instance, for a model this is the document that holds that model. By 
     * default this returns the entire state
     * @param state
     */
    resolveSubstate(state) {
        return state
    }
    
    /***
     * Checks to see if model, medium, etc of the given key needs to be fetched from the server
     * @param state
     * @param entryKey
     * @returns {*}
     */
    shouldFetch(state, entryKey) {
        const entry = state.getIn([this.key, 'entries', entryKey]);
        // Only return true if the entry is registered but not already loading or loaded
        // TODO we could try loading here if there is an error status
        return (entry.get('status') === Statuses.INITIALIZED);
    }

    /***
     * Fetches the model, medium, etc of the given key if it hasn't been loaded yet
     * @param entryKey
     * @returns {function()}
     */
    fetchIfNeeded(entryKey) {

        // Note that the function also receives getState()
        // which lets you choose what to dispatch next.
    
        // This is useful for avoiding a network request if
        // a cached value is already available.
    
        var self = this;
        return (dispatch, getState) => {
            // Get the substate containing the thing we are fetching.
            // This defaults to the entire state but might be overridden in a subclass
            var state = self.resolveSubstate(getState())
            if (self.shouldFetch(state, entryKey)) {
                // Dispatch a thunk from thunk!
                return dispatch(self.doFetch(state, entryKey))
            } else {
                // Let the calling code know there's nothing to wait for.
                return Promise.resolve()
            }
        }
    }

    /***
     * This asynchronous action loads a model, medium, etc from its source (e.g. Sketchup 3D Warehouse)
     * @param state
     * @param entryKey: The key of the model, medium, etc to load.
     * @returns {Function}
     */
    doFetch(state, entryKey) {
        const self = this;
        return function (dispatch) {
    
    
            // The function called by the thunk middleware can return a value,
            // that is passed on as the return value of the dispatch method.
            // In this case, we return a promise to wait for.
            // This is not required by thunk middleware, but it is convenient for us.
            const entry = state.getIn([self.key, 'entries', entryKey]);
            const url = self.makeLoadUrl(state.get(self.key), entry)
            
            // First dispatch: the app state is updated to inform
            // that the API call is starting.
            dispatch(self.loadIt(entryKey, url));
            
            return fetch(url)
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        return response
                    } else {
                        var error = new Error(response.statusText)
                        error.response = response
                        throw error
                    }
                })
                .then(response => response.text())
                .then(json =>
                    // Here, we update the app state with the results of the API call.
                    dispatch(self.receive(entryKey, json))
                )
                .catch(error => console.log('request failed', error))
        }
    }
}