import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import {fw} from '../src/index';


describe("Form Wizard", function() {
  this.timeout(30000);

  it("Basic form.", () => {
      var data = null;
      const submitCallback = function(event, form) {
          data = form.data();
      };
      const componentDefinition = (<fw.Form onSubmit={submitCallback} onValidationError={submitCallback}>
              <fw.Input type="checkbox" name="mainSection.enabled" inputId="inp-chb" label="Input one"/>
              <fw.Input type="text" name="mainSection.text" inputId="inp-txt" label="Input text"/>
              <input type="text" name="pure" value="pureDefault"/>
              <input type="submit" className="btn-primary" />
          </fw.Form>);
      const component = TestUtils.renderIntoDocument(componentDefinition);
      const form = TestUtils.findRenderedDOMComponentWithTag(component, "form");
      const inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
      console.debug('Form is:', form);

      for(let i=0; i<inputs.length; i++) {
          if (inputs[i].type == 'checkbox') {
              TestUtils.Simulate.change(inputs[i], { target: { value: true } });
          }
          if (inputs[i].type == 'text') {
              TestUtils.Simulate.change(inputs[i], { target: { value: 'Text_' + i } });
          }
      }
      TestUtils.Simulate.submit(form);

      console.debug('Data is:', data);
      assert(data != null, "Data is null");
      assert(data.mainSection.enabled === true, "Checkbox not ok");
      assert(data.mainSection.text === 'Text_1', "Text not ok");
      //assert(data.pure === 'Text_2', "Pure text not ok"); // TODO - implement first
  });

});
