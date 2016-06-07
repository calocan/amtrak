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
import {SET_STATE} from '../../src/actions/article'
import * as actions from '../../src/actions/document'
import Statuses from '../../src/statuses'

const state = Map({
    keys: List(['amtrak_standard', 'new_rules_of_the_road']),
    current: 'amtrak_standard',
    entities: Map({
        'amtrak_standard': Map({
            status: Statuses.READY,
            models: ['tram', 'station'],
        }),
        'new_rules_of_the_road': Map({
            status: Statuses.LOADING,
            models: ['freeway', 'boulevard'],
        }),
    })
}) 

describe('models_reducer', () => {
    const setStateAction = {
        type: SET_STATE,
        // Example models state. This needs to be a 'full' state, thus the models keys
        // SET_STATE always expects action.state to be a full state
        state: Map({documents:state})
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
        expect(nextState.getIn(['entities', action.key, 'status'])).to.equal(Statuses.INITIALIZED)
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
        expect(nextState.getIn(['entities', action.key, 'status'])).to.equal(Statuses.LOADING)
    });

    it('handles RECEIVE_MODEL', () => {
        const action = {
            type: actions.RECIEVE_MODEL,
            key: 'train_station'
        };

        const initialState = reducer(undefined, setStateAction)
        const nextState = reducer(initialState, action).get('models');
        expect(nextState.get('keys')).to.include(action.key)
        expect(nextState.get('entities', action.key)).to.be.ok
        expect(nextState.getIn(['entities', action.key, 'status'])).to.equal(Statuses.READY)
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
        expect(nextState.getIn(['entities', action.key, 'status'])).to.equal(Statuses.ERROR)
    });
});