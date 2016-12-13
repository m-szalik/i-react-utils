import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import GlobalMessage from '../src/GlobalMessage';


test("Render: empty", () => {
    const component = TestUtils.renderIntoDocument(<GlobalMessage><span>Some text here</span></GlobalMessage>);
    const gm = TestUtils.findRenderedDOMComponentWithClass(component, 'globalMessages');
    assert(gm.innerHTML == '', 'Are there some messages there?');
});

test("Render: message success & clear", () => {
    const comp = TestUtils.renderIntoDocument(<GlobalMessage><span>Some text here</span></GlobalMessage>);

    // test add
    comp.message('success', 'A success message');
    let domMessages = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'alert');
    assert(domMessages.length == 1, 'Invalid number of messages (should be one). => ' + domMessages.length);
    assert(domMessages[0].innerHTML == 'A success message', 'Missing message');

    // test clear
    comp.clear();
    domMessages = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'alert');
    assert(domMessages.length == 0, 'Invalid number of messages (should be zero). => ' + domMessages.length);
});
