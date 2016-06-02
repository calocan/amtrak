import React from 'react';
import {
    renderIntoDocument,
    scryRenderedDOMComponentsWithTag,
    Simulate
} from 'react-addons-test-utils';
import {SET_STATE} from '../../src/actions/actions'
import reducer from '../../src/reducers/reducer'
import {Map} from 'immutable';
import Article from '../../src/components/Article'
import {Provider} from 'react-redux';
import makeStore from '../../src/store'
import TestUtils from 'react-addons-test-utils'

const url = 'https://docs.google.com/document/d/1GbrsFkL4hlMP9o-J1JLw4Qu08j6hEPde_ElJdanJX5U/pub?embedded=true'

function setup() {
    let renderer = TestUtils.createRenderer();
    const store = makeStore()
    const state = store.getState()
    // We need to wrap article in a Provider in order to pass it a store
    renderer.render(
        <Article store={store} settings={state.get('settings')} document={state.get('document')} models={state.get('models')} />
    );
    return renderer.getRenderOutput();
}

describe('Article', () => {

    it('loads an article from an external source', () => {

        const component = setup()
        // TODO
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons.length).to.equal(2);
        expect(buttons[0].textContent).to.equal('Trainspotting');
        expect(buttons[1].textContent).to.equal('28 Days Later');

        Simulate.click(buttons[0]);
        expect(votedWith).to.equal('Trainspotting');
    });
});