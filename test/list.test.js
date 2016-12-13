import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import List from '../src/List';

function trToString(tr) {
    return tr.getAttribute('data-index') + ':' + tr.getAttribute('data-item');
}

const rr = function(item,index,reactRowKey) {
    return (<tr key={reactRowKey} data-index={index} data-item={item}><td style={{"background":item}}>{item}</td></tr>);
};
const noDataComponent = (<span>no data</span>);
const data = ['orange', 'blue', 'brown', 'red', 'yellow'];

test("Render list with data", () => {
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

test("Render list with data + pagination", () => {
    let onPageChangeCounter = 0;
    const componentDefinition = (<List data={data} renderRow={rr} count={2} onPageChanged={() => { onPageChangeCounter++; }}></List>);
    const dom = TestUtils.renderIntoDocument(componentDefinition);
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'tr');
    assert(trs.length == 2, "TRs not OK");
    expect(trToString(trs[0])).toBe('0:orange');
    expect(trToString(trs[1])).toBe('1:blue');

    const pgLi = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'li');
    const pgNext = pgLi[pgLi.length - 1];
    TestUtils.Simulate.click(pgNext);

    expect(onPageChangeCounter).toBe(1);
    trs = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'tr');
    expect(trToString(trs[0])).toBe('2:brown');
    expect(trToString(trs[1])).toBe('3:red');
});

test("Render list without data, headerAlwaysOn=true", () => {
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

test("Render list without data, headerAlwaysOn=false", () => {
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

test("Render list without data, headerAlwaysOn=true + customNoDataComponent", () => {
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

test("Render list without data, headerAlwaysOn=false + customNoDataComponent", () => {
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
