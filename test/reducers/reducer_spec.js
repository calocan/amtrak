import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../../src/reducers/reducer';
import {SET_STATE} from '../../src/actions/article'
import {SET_3D, SET_RELATED_IMAGES} from '../../src/actions/settings'
import statuses from '../../src/statuses'

describe('reducer', () => {

  const action = {
    type: SET_STATE,
    // Example full state
    state: Map({
      settings: Map({
        [SET_3D]: false,
        [SET_RELATED_IMAGES]: false
      }),
      models: Map({
        keys: ['train_station', 'ubahn', 'tram'],
        current: 'train_station',
        entities: Map({
          'train_station': Map({
            status: statuses.READY,
            scenes: Map({
              keys: ['coat_check', 'platform'],
              current: 'platform',
            })  
          }),
          'ubahn': Map({
            status: statuses.LOADING,
            scenes: Map({
              keys: ['bathroom', 'private_compartments'],
              current: 'bathroom',
            })
          }),
          'tram': Map({
            status: statuses.LOADING,
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
