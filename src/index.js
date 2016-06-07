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
import React from 'react'
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import App from './components/App'
import Site from './components/Site'
import makeStore from './store'
import {Provider} from 'react-redux';
import {fetchDocumentIfNeeded} from './actions/document'
import {fetchModelIfNeeded} from './actions/model'
import {Map, List} from 'immutable'

const store = makeStore()
/***
 * App is the common component for all of our routes
 */
const routes = <Route component={App}>
    <Route path="/" component={Site} />
</Route>;

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>{routes}</Router>
    </Provider>,
    document.getElementById('app')
);

// This initial state belongs somewhere outside of teh code. Perhaps I'll put it in a json file
import Statuses from './statuses'
import {setState} from './actions/site'
const state = Map({
    documents: Map({
        keys: List(['amtrak_standard', 'the_new_rules_of_the_road']),
        current: 'amtrak_standard',
        baseUrl: id => (`https://docs.google.com/document/d/${id}/pub`),
        entries: Map({
            'amtrak_standard': Map({
                status: Statuses.INITIALIZED,
                title: 'The AMTRAK Standard',
                id: '1GbrsFkL4hlMP9o-J1JLw4Qu08j6hEPde_ElJdanJX5U',
                modelKeys: ['AMTRAK Superliner', 'AMTRAK Café Car']
            }),
            'the_new_rules_of_the_road': Map({
                status: Statuses.INITIALIZED,
                title: 'The New Rules of the Road',
            })
        })
    }),
    models: Map({
        keys: List(['AMTRAK Superliner', 'AMTRAK Café Car']),
        current: 'AMTRAK Superliner',
        baseUrl: (id, width, height) => (`https://3dwarehouse.sketchup.com/embed.html?mid=${id}&width=${width}&height=${height}`),
        width: 580,
        height: 326,
        entries: Map({
            'AMTRAK Superliner': Map({
                status: Statuses.INITIALIZED,
                id: '7aefec04-7954-4b62-b863-779468176c6d'
                //id: '419df1d2-949f-4e60-adbc-59da24a5c6ce'
            })
        })
    })
})


store.dispatch(setState(state))
store.dispatch(fetchDocumentIfNeeded('amtrak_standard'))

store.dispatch(setState(state))
store.dispatch(fetchModelIfNeeded('AMTRAK Superliner'))
