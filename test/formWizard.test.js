import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import {fw} from '../src/index';


describe("Form Wizard", function() {
  this.timeout(30000);

  it("Should render.", () => {
        const component = (<div>
          <fw.Form>
              <fw.Input type="checkbox" name="inp1" label="Input one"/>
          </fw.Form>
        </div>);
      TestUtils.renderIntoDocument(component);
  });

});
