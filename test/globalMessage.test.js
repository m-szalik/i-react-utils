import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import GlobalMessage from '../src/GlobalMessage';


describe("GlobalMessage", function() {
  this.timeout(30000);

  it("Render GlobalMessage", () => {
      console.log('LOG_', GlobalMessage);
      const componentDefinition = (<GlobalMessage><span>Some text here</span></GlobalMessage>);
      const component = TestUtils.renderIntoDocument(componentDefinition);
  });

});
