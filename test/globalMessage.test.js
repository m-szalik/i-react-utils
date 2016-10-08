import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import {GlobalMessage} from '../src/index';


describe("GlobalMessage", function() {
  this.timeout(30000);

  it("Render GlobalMessage", () => {
      var data = ['orange', 'blue', 'brown', 'red', 'yellow'];
      const componentDefinition = (<GlobalMessage><span>Some text here</span></GlobalMessage>);
      const component = TestUtils.renderIntoDocument(componentDefinition);
  });

});
