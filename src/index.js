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

// Do this once before any other code in your app (http://redux.js.org/docs/advanced/AsyncActions.html)
import 'babel-polyfill'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom';
import {Route} from 'react-router';
import { Provider } from 'react-redux'
import reducer from './reducers/reducer';
import {loadDocument, fetchModelIfNeeded} from './actions'
import ArticleContainer from './components/Article'

// Create a logger
const loggerMiddleware = createLogger()

// Create the store applying our reducer and the thunk and logger middleware
const store = createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    )
)

// Fetch our document. This url can come from somewhere more dynamic later
const url = "https://docs.google.com/document/d/1GbrsFkL4hlMP9o-J1JLw4Qu08j6hEPde_ElJdanJX5U/pub"
// Dispatch the loadDocument async action and log the result when it finishes
store.dispatch(loadDocument(url)).then(() =>
    console.log(store.getState())
)
const initialModel = 'train';
// Hard-code the initial models and fetch them here, instead of relying on the user scroll.
store.dispatch(fetchModelIfNeeded(initialModel).then(() =>
    console.log(store.getState())
)

const routes = <Route component={App}>
    <Route path="/" component={ArticleContainer} />
</Route>;

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>{routes}</Router>
    </Provider>,
    document.getElementById('app')
);
