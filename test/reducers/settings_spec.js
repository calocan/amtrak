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
import * as actions from '../../src/actions/settings'

describe('settings_reducer', () => {
    it('handles SET_[setting]', () => {
        
        // The initial settings can be empty, which means default values are expected
        const initialSettingsState = Map({
        });
        
        // Act to set a setting to false
        const action = {
            type: actions.SET_3D,
            value: false
        };
        const nextState = reducer(initialSettingsState, action);

        // Expect the settings to be false
        expect(nextState.get('settings')).to.equal(fromJS({
            [actions.SET_3D]: false
        }));
    });
});
