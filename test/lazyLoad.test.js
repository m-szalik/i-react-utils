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


describe("LazyLoad", function() {
    this.timeout(30000);

    it("Render - loading", () => {
        const promise = new Promise(function(resolve, reject) { });
        const componentDefinition = (<LazyLoad style={{color:'red'}} ajax={() => promise} component={SuccessComponent} errorComponent={ErrorComponent} loadingComponent={<span className="loading">loading</span>}>content</LazyLoad>);
        let component = TestUtils.renderIntoDocument(componentDefinition);
        let span = TestUtils.scryRenderedDOMComponentsWithTag(component, 'span')[0];
        assert(span.className == 'loading', "Loading is OK");
    });

});
