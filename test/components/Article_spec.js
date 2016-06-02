import React from 'react';
import {
    renderIntoDocument,
    scryRenderedDOMComponentsWithTag,
    Simulate
} from 'react-addons-test-utils';
import {Article, ArticleContainer} from '../../src/components/Article'
import {SET_STATE} from '../../src/actions/actions'
import reducer from '../../src/reducers/reducer'
import {Map} from 'immutable';

const state = reducer(Map(), SET_STATE);
const url = 'https://docs.google.com/document/d/1GbrsFkL4hlMP9o-J1JLw4Qu08j6hEPde_ElJdanJX5U/pub?embedded=true'
describe('Article', () => {

    it('loads an article from an external source', () => {
        const component = renderIntoDocument(
            <Article settings={state.get('settings')} document={state.get('document')} showcase={state.get('showcase')} />
        );
        // TODO
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons.length).to.equal(2);
        expect(buttons[0].textContent).to.equal('Trainspotting');
        expect(buttons[1].textContent).to.equal('28 Days Later');

        Simulate.click(buttons[0]);
        expect(votedWith).to.equal('Trainspotting');
    });
});