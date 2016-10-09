import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import List from '../src/List';


describe("List", function() {
  this.timeout(30000);

  it("Render list", () => {
      var data = ['orange', 'blue', 'brown', 'red', 'yellow'];
      const componentDefinition = (<List data={data} renderRow={function(item,index,reactRowKey) {
        return (<tr key={reactRowKey}><td style={{"background":item}}>{item}</td></tr>);
      }}>
            <thead><tr><th>colored rows</th></tr></thead>
            <tfoot><tr><th>End of table</th></tr></tfoot>
      </List>);
      const component = TestUtils.renderIntoDocument(componentDefinition);
      const trs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
      const tds = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');
      assert(trs.length == data.length +2, "TRs not OK"); // +1 for header and +1 for footer
      assert(tds.length == data.length, "TDs not OK");
  });

});
