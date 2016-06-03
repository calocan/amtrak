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
import ActionLoader from '../ActionLoader'

/*
 * Action types. See action definition for explanation
*/

export const REGISTER_DOCUMENT = 'REGISTER_DOCUMENT'
export const LOAD_DOCUMENT = 'LOAD_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'
export const DOCUMENT_ERRED = 'DOCUMENT_ERRED'

/*
 * Action creators. 
 * List in the same order as the action types.
 */

/***
 * Register the given unloaded documents when encountered in the DOM or via the browser URL/parameters
 * This does not load the medium since we might want to skip, queue or otherwise delay loading
 *
 * @param key: The invariable key of the medium (e.g. 'denver_train_station_exterior')
 * @returns {{type: string, key: *}}
 */
export function register(key) {
    return { type: REGISTER_DOCUMENT, key }
}

class DocumentLoader extends ActionLoader {

    constructor() {
        super()
        this.key = 'documents'
    }

    /***
     * The baseUrl for the documents state has a parameter to accept the documents's id
     * @param state: The substate for documents
     * @param entry: The documents to be loaded
     * @returns {*}
     */
    makeLoadUrl(state, entry) {
        // This will normally need overriding
        return state.get('baseUrl')(entry.get('id'))
    }

    /***
     * Indicates that the documents is loading
     * @param url: The url of the documents (e.g. a Google Docs url)
     * @returns {{type: string, url: *}}
     */
    loadIt(url) {
        return {
            type: LOAD_DOCUMENT,
            url
        }
    }

    /***
     * Indicates that the documents is being received
     * @param url: The url of the documents 
     * @param json: The json of the documents
     * @returns {{type: string, url: *, content: *, receivedAt: number}}
     */
    receive(url, json) {
        return {
            type: RECEIVE_DOCUMENT,
            url,
            content: json.data,
            receivedAt: Date.now()
        }
    }

    /***
     * Indicates that the loading of the documents erred
     *
     * @param url: The invariable url of the documents
     * @returns {{type: string, key: *}}
     */
    erred(url) {
        return { type: DOCUMENT_ERRED, url }
    }

}
// Use an ActionLoader to remotely load models
export const documentLoader = new DocumentLoader();
// Export the only public method of the action loader
export const fetchDocumentIfNeeded = documentLoader.fetchIfNeeded.bind(documentLoader)
