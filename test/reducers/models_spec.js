/**
 * Created by Andy Likuski on 2016.05.25
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../../src/reducers/reducer';
import * as actions from '../../src/actions/actions'

const state = Map({
    keys: List(['train_station', 'ubahn', 'tram']),
    current: 'train_station',
    entities: Map({
        'train_station': Map({
            status: actions.Statuses.READY,
            scenes: Map({
                keys: ['coat_check', 'platform'],
                current: 'platform',
            })
        }),
        'ubahn': Map({
            status: actions.Statuses.LOADING,
            scenes: Map({
                keys: ['bathroom', 'private_compartments'],
                current: 'bathroom',
            })
        }),
        'tram': Map({
            status: actions.Statuses.LOADING,
            scenes: Map({
                keys: ['café', 'boading'],
                current: 'café',
            })
        })
    })
}) 

describe('models_reducer', () => {
    const setStateAction = {
        type: actions.SET_STATE,
        // Example models state. This needs to be a 'full' state, thus the models keys
        // SET_STATE always expects action.state to be a full state
        state: Map({models:state})
    };

    let nextState
    it('handles SET_STATE', () => {
        const initialState = Map();
        nextState = reducer(initialState, setStateAction);
        expect(nextState.get('models')).to.equal(setStateAction.state.get('models'))
    });

    it('handles SET_STATE without initial state', () => {
        nextState = reducer(undefined, setStateAction);
        expect(nextState.get('models')).to.equal(setStateAction.state.get('models'))
    });

    it('handles REGISTER_MODEL', () => {
        const action = {
            type: actions.REGISTER_MODEL,
            key: 'train_station'
        };

        const initialState = reducer(undefined, setStateAction)
        const nextState = reducer(initialState, action).get('models');
        expect(nextState.get('keys')).to.include(action.key)
        expect(nextState.get('entities', action.key)).to.be.ok
        expect(nextState.getIn(['entities', action.key, 'status'])).to.equal(actions.Statuses.INITIALIZED)
    });
    
    it('handles LOAD_MODEL', () => {
        const action = {
            type: actions.LOAD_MODEL,
            key: 'train_station'
        }

        const initialState = reducer(undefined, setStateAction)
        const nextState = reducer(initialState, action).get('models');
        expect(nextState.get('keys')).to.include(action.key)
        expect(nextState.get('entities', action.key)).to.be.ok
        expect(nextState.getIn(['entities', action.key, 'status'])).to.equal(actions.Statuses.LOADING)
    });

    it('handles RECIEVE_MODEL', () => {
        const action = {
            type: actions.RECIEVE_MODEL,
            key: 'train_station'
        };

        const initialState = reducer(undefined, setStateAction)
        const nextState = reducer(initialState, action).get('models');
        expect(nextState.get('keys')).to.include(action.key)
        expect(nextState.get('entities', action.key)).to.be.ok
        expect(nextState.getIn(['entities', action.key, 'status'])).to.equal(actions.Statuses.READY)
    });
    
    it('handles MODEL_ERRED', () => {
        const action = {
            type: actions.MODEL_ERRED,
            key: 'train_station'
        };

        const initialState = reducer(undefined, setStateAction)
        const nextState = reducer(initialState, action).get('models');
        expect(nextState.get('keys')).to.include(action.key)
        expect(nextState.get('entities', action.key)).to.be.ok
        expect(nextState.getIn(['entities', action.key, 'status'])).to.equal(actions.Statuses.ERROR)
    });
});