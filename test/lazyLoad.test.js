import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import LazyLoad from '../src/LazyLoad';


class SuccessComponent extends React.Component {
    render() {
        return <span {...this.props} className="success">{this.props.children}</span>
    }
}

class ErrorComponent extends React.Component {
    render() {
        return <span {...this.props} className="error">{this.props.children}</span>
    }
}

function createTestComponent(promise) {
    const componentDefinition = (<LazyLoad style={{color:'red'}} ajax={() => promise} component={SuccessComponent} errorComponent={ErrorComponent} loadingComponent={<span className="loading">loading</span>}>content</LazyLoad>);
    return TestUtils.renderIntoDocument(componentDefinition);
}

describe("LazyLoad - loading", function() {
    this.timeout(30000);

    const component = createTestComponent(new Promise(function(resolve, reject) { }));
    it("Render", () => {
        let span = TestUtils.scryRenderedDOMComponentsWithTag(component, 'span')[0];
        assert(span.className == 'loading', "Loading is " + span.className);
    });
});

describe("LazyLoad - success", function() {
    this.timeout(30000);
    let callback;
    const component = createTestComponent(new Promise(function(resolve, reject) { callback = resolve; }));
    callback({data:'AjaxSuccess'});
    it("Render", () => {
        let span = TestUtils.scryRenderedDOMComponentsWithTag(component, 'span')[0];
        assert(span.className == 'success', "Success className is " + span.className);
        assert(span.innerHTML == 'content', "Failure content is " + span.innerHTML);
    });
});

describe("LazyLoad - failure", function() {
    this.timeout(30000);
    let callback;
    const component = createTestComponent(new Promise(function(resolve, reject) { callback = reject; }));
    callback({response: {data:'AjaxFail'}});
    it("Render", () => {
        let span = TestUtils.scryRenderedDOMComponentsWithTag(component, 'span')[0];
        assert(span.className == 'error', "Failure className is " + span.className);
        assert(span.innerHTML == 'content', "Failure content is " + span.innerHTML);
    });
});
