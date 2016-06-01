import {Statuses} from "./statuses";
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

    /***
     * Constructs an ActionLoader with the various action functions needed to fully load
     * something. We also provide a key in the props that indicates how to find the substate
     * relative to the thing we are loading
     * @param props
     */
    constructor(props) {
        super(props)
        this.key = props.key
        this.register = props.register
        this.loadIt = props.load
        this.receive = props.receive
        this.erred = props.erred
    }
    
    /***
     * Checks to see if model, medium, etc of the given key needs to be fetched from the server
     * @param state
     * @param key
     * @returns {*}
     */
    shouldFetch(state, key) {
        const entry = state.getIn([this.key, 'entries', key]);
        // Only return true if the entry is registered but not already loading or loaded
        // TODO we could try loading here if there is an error status
        return (entry.get('status') === Statuses.INITIALIZED);
    }

    /***
     * Fetches the model, medium, etc of the given key if it hasn't been loaded yet
     * @param state
     * @param key
     * @returns {function()}
     */
    fetchlIfNeeded(state, key) {

        // Note that the function also receives getState()
        // which lets you choose what to dispatch next.
    
        // This is useful for avoiding a network request if
        // a cached value is already available.
    
        return (dispatch, getState) => {
            if (this.shouldFetch(getState(), key)) {
                // Dispatch a thunk from thunk!
                return dispatch(this.fetch(getState(), key))
            } else {
                // Let the calling code know there's nothing to wait for.
                return Promise.resolve()
            }
        }
    }

    /***
     * This asynchronous action loads a model, medium, etc from its source (e.g. Sketchup 3D Warehouse)
     * @param state
     * @param key: The key of the model, medium, etc to load.
     * @returns {Function}
     */
    fetch(state, key) {
    
        return function (dispatch) {
    
            // First dispatch: the app state is updated to inform
            // that the API call is starting.
            dispatch(this.loadIt(key));
    
            // The function called by the thunk middleware can return a value,
            // that is passed on as the return value of the dispatch method.
            // In this case, we return a promise to wait for.
            // This is not required by thunk middleware, but it is convenient for us.
            return fetch(state.get('baseUrl')+key)
                .then(response => response.json())
                .then(json =>
                    // Here, we update the app state with the results of the API call.
                    dispatch(this.receive(key, json))
                )
            // In a real world app, you also want to
            // catch any error in the network call.
        }
    }
}