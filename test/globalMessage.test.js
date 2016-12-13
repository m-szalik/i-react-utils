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

test("Render: message close", () => {
    const comp = TestUtils.renderIntoDocument(<GlobalMessage><span>Some text here</span></GlobalMessage>);
    const msg = comp.message('success', 'A success message');
    msg.close();
    const domMessages = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'alert');
    assert(domMessages.length == 0, 'Invalid number of messages (should be zero). => ' + domMessages.length);
});

test("Render: message timeout", () => {
    const comp = TestUtils.renderIntoDocument(<GlobalMessage><span>Some text here</span></GlobalMessage>);
    const msg = comp.message('success', 'A success message');
    msg.timeout(200);
    const domMessages = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'alert');
    assert(domMessages.length == 1, 'Invalid number of messages (should be one). => ' + domMessages.length);
    const promise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 300);
    });
    promise.then(() => {
        const domMessages = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'alert');
        assert(domMessages.length == 0, 'Invalid number of messages (should be zero). => ' + domMessages.length);
    });
    return promise;
});

test("Integration", () => {
    class TestComponent extends React.Component {
        static contextTypes = {
            messenger: React.PropTypes.object
        };
        handleClick() {
            const messenger = this.context.messenger;
            messenger.clear();
            messenger.success('success message');
            messenger.info('info message');
            messenger.warning('warning message 0');
            messenger.error('error message 0');
            const m0 = messenger.warn('warning message 1');
            const m1 = messenger.danger('error message 1');
            messenger.close(m0);
            messenger.close(m1);
        }
        render() { return <button onClick={this.handleClick.bind(this)}>click me</button>; }
    }

    const comp = TestUtils.renderIntoDocument(<GlobalMessage><span>Some text here</span><TestComponent/></GlobalMessage>);
    const button = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');
    TestUtils.Simulate.click(button);

    const promise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 50);
    });
    promise.then(() => {
        const domMessages = TestUtils.scryRenderedDOMComponentsWithClass(comp, 'alert');
        assert(domMessages.length == 4, 'Invalid number of messages (should be zero). => ' + domMessages.length);
    });
    return promise;
});

