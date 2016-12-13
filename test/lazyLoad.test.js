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

function createTestComponent(ajaxFunction) {
    return (<LazyLoad style={{color:'red'}} ajax={ajaxFunction} component={SuccessComponent} errorComponent={ErrorComponent} loadingComponent={<span className="loading">loading</span>}>content</LazyLoad>);
}


test("Render - success", () => {
    const shallowRenderer = TestUtils.createRenderer();
    let callback;
    const promise = new Promise(function(resolve, reject) { callback = resolve; });
    const component = createTestComponent(function() { return promise; });
    let dom = shallowRenderer.render(component);
    const className = dom.props.className;
    assert(className == 'loading', "ClassName is " + className + " but should be loading");
    callback({data:'AjaxSuccess'});
    return Promise.all([promise]).then(() => {
        dom = shallowRenderer.render(component);
        assert(dom.props.data == 'AjaxSuccess', "Invalid data");
    });
});
