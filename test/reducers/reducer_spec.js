import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../../src/reducers/reducer';
import * as actions from '../../src/actions'

describe('reducer', () => {

  const action = {
    type: 'SET_STATE',
    // Example full state
    state: Map({
      settings: Map({
        [actions.SET_3D]: false,
        [actions.SET_RELATED_IMAGES]: false
      }),
      models: Map({
        keys: ['train_station', 'ubahn', 'tram'],
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
    })
  };
  
  it('handles SET_STATE', () => {
    const initialState = Map();
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(action.state)
  });

  it('handles SET_STATE without initial state', () => {
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(action.state)
  });

});
