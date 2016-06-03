import React from 'react';
import ReactDOM from 'react-dom';
import {
    renderIntoDocument,
    scryRenderedDOMComponentsWithTag,
    Simulate
} from 'react-addons-test-utils';
import Document from '../../src/components/Document'

const url = 'https://docs.google.com/documents/d/1GbrsFkL4hlMP9o-J1JLw4Qu08j6hEPde_ElJdanJX5U/pub?embedded=true'
describe('Document', () => {
    it('detects scrolling of the documents', () => {
        const component = renderIntoDocument(
            <Document url={url} />
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