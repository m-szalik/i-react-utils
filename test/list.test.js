import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import List from '../src/List';


describe("List", function() {
    this.timeout(30000);
    const rr = function(item,index,reactRowKey) {
        return (<tr key={reactRowKey}><td style={{"background":item}}>{item}</td></tr>);
    };

    const noDataComponent = (<span>no data</span>);

    it("Render list with data", () => {
        const data = ['orange', 'blue', 'brown', 'red', 'yellow'];
        const componentDefinition = (<List data={data} renderRow={rr}>
            <thead><tr><th>colored rows</th></tr></thead>
            <tfoot><tr><th>End of table</th></tr></tfoot>
        </List>);
        const component = TestUtils.renderIntoDocument(componentDefinition);
        const trs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
        const tds = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');
        assert(trs.length == data.length +2, "TRs not OK"); // +1 for header and +1 for footer
        assert(tds.length == data.length, "TDs not OK");
    });

    it("Render list without data, headerAlwaysOn=true", () => {
        const componentDefinition = (<List data={[]} headerAlwaysOn={true} renderRow={rr}>
            <thead><tr><th>colored rows</th></tr></thead>
            <tfoot><tr><th>End of table</th></tr></tfoot>
        </List>);
        const component = TestUtils.renderIntoDocument(componentDefinition);
        const trs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
        const tds = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');
        assert(trs.length == 2, "TRs not OK"); // +1 for header and +1 for footer
        assert(tds.length == 0, "TDs not OK");
    });

    it("Render list without data, headerAlwaysOn=false", () => {
        const componentDefinition = (<List data={[]} headerAlwaysOn={false} renderRow={rr}>
            <thead><tr><th>colored rows</th></tr></thead>
            <tfoot><tr><th>End of table</th></tr></tfoot>
        </List>);
        const component = TestUtils.renderIntoDocument(componentDefinition);
        const trs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
        const tds = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');
        assert(trs.length == 0, "TRs not OK"); // +1 for header and +1 for footer
        assert(tds.length == 0, "TDs not OK");
    });

    it("Render list without data, headerAlwaysOn=true + customNoDataComponent", () => {
        const componentDefinition = (<List data={[]} headerAlwaysOn={true} noDataComponent={noDataComponent} renderRow={rr}>
            <thead><tr><th>colored rows</th></tr></thead>
            <tfoot><tr><th>End of table</th></tr></tfoot>
        </List>);
        const component = TestUtils.renderIntoDocument(componentDefinition);
        const trs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
        const tds = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');
        const spans = TestUtils.scryRenderedDOMComponentsWithTag(component, 'span');
        assert(trs.length == 3, "TRs not OK " + trs.length); // +1 for header and +1 for footer +1 for custom noDataComponent
        assert(tds.length == 1, "TDs not OK " + tds.length); // +1 for custom noDataComponent
        assert(spans.length == 1, "Spans not OK " + spans.length);
    });

    it("Render list without data, headerAlwaysOn=false + customNoDataComponent", () => {
        const componentDefinition = (<List data={[]} headerAlwaysOn={false} noDataComponent={noDataComponent} renderRow={rr}>
            <thead><tr><th>colored rows</th></tr></thead>
            <tfoot><tr><th>End of table</th></tr></tfoot>
        </List>);
        const component = TestUtils.renderIntoDocument(componentDefinition);
        const trs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
        const tds = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');
        const spans = TestUtils.scryRenderedDOMComponentsWithTag(component, 'span');
        assert(trs.length == 1, "TRs not OK " + trs.length); // +1 for custom noDataComponent
        assert(tds.length == 1, "TDs not OK " + tds.length); // +1 for custom noDataComponent
        assert(spans.length == 1, "Spans not OK " + spans.length);
    });
});
