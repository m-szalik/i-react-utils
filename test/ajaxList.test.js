import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import AjaxList from '../src/AjaxList';

const responseData = {"items":['orange', 'blue', 'brown', 'red', 'yellow'],"paging":{"total":0,"page":1,"count":1}};

const renderRow = function(item,index,reactRowKey) {
    return (<tr key={reactRowKey}><td style={{"background":item}}>{item}</td></tr>);
};

test("Render list", () => {
  const callbackContainer = [];
  let promiseCallback;
  const promise = new Promise(function(resolve, reject) { promiseCallback = resolve; });
  const componentDefinition = (
        <AjaxList renderRow={renderRow} fetchDataCallback={(page)=>{ callbackContainer.push('page-' + page); return promise}}
                onFetch={()=>{callbackContainer.push('fetch')}} onSuccess={()=>{callbackContainer.push('success')}}
                onClick={()=>{ promiseCallback({data : responseData}); console.debug('Ajax request done.'); }}
        >
            <thead><tr><th>colored rows</th></tr></thead>
            <tfoot><tr><th>End of table</th></tr></tfoot>
        </AjaxList>
  );
  const component0 = TestUtils.renderIntoDocument(componentDefinition);
  const list0 = TestUtils.scryRenderedDOMComponentsWithTag(component0, 'div')[0];
  TestUtils.Simulate.click(list0);

  // TODO finish it
});

