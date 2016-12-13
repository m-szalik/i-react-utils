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
