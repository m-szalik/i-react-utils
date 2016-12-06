import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import GlobalMessage from '../src/GlobalMessage';


describe("GlobalMessage", function() {
    this.timeout(3000);

    const component = TestUtils.renderIntoDocument(<GlobalMessage><span>Some text here</span></GlobalMessage>);

    it("Render: empty", () => {
        const gm = TestUtils.findRenderedDOMComponentWithClass(component, 'globalMessages');
        assert(gm.innerHTML == '', 'Are there some messages there?');
    });

});
