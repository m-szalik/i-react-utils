import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import * as fw from '../src/FormWizard';


test("FormWizard: Basic form.", () => {
  var data = null;
  const submitCallback = function(event, form) {
      data = form.data();
  };
  const componentDefinition = (<fw.Form onSubmit={submitCallback} onValidationError={submitCallback}>
          <fw.Input type="checkbox" name="mainSection.enabled" inputId="inp-chb" label="Input one"/>
          <fw.Input type="text" name="mainSection.text" inputId="inp-txt" label="Input text"/>
          <fw.Input type="textarea" name="mainSection.memo" inputId="inp-memo" label="Input textarea"/>
          <fw.Input type="select" name="mainSection.select" inputId="inp-select" label="Input select" options={['op0', 'op1', 'op2']}/>
          <input type="text" name="pure" defaultValue="pureDefault"/>
          <input type="submit" className="btn-primary" />
      </fw.Form>);
  const component = TestUtils.renderIntoDocument(componentDefinition);
  const form = TestUtils.findRenderedDOMComponentWithTag(component, "form");
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
  const selectOps = TestUtils.scryRenderedDOMComponentsWithTag(component, 'option');
  const textareas = TestUtils.scryRenderedDOMComponentsWithTag(component, 'textarea');
  console.debug('Form is:', form);

  for(let i=0; i<inputs.length; i++) {
      if (inputs[i].type == 'checkbox') {
          TestUtils.Simulate.change(inputs[i], { target: { value: true } });
      }
      if (inputs[i].type == 'text') {
          TestUtils.Simulate.change(inputs[i], { target: { value: 'Text_' + i } });
      }
  }
  TestUtils.Simulate.change(textareas[0], { target: { value: 'TextArea' } });

  TestUtils.Simulate.submit(form);

  expect(data).not.toBe(null);
  expect(data.mainSection.enabled).toBe(true);
  expect(data.mainSection.text).toBe('Text_1');
  expect(data.mainSection.memo).toBe('TextArea');
  expect(selectOps.length).toBe(3 + 1);
  //expect(data.pure).toBe("Text_2"); // TODO - implement it first in the component
});

test("Validator createIsRequiredFormValidator", () => {
    const validator = fw.createIsRequiredFormValidator('required');
    expect(validator.validatorFunction("ABC")).toBe(true);
    expect(validator.validatorFunction("")).toBe(false);
    expect(validator.validatorFunction(undefined)).toBe(false);
    expect(validator.validatorFunction(" ")).toBe(false);
});

test("Validator createMinLengthFormValidator", () => {
    const validator = fw.createMinLengthFormValidator(3, 'min length');
    expect(validator.validatorFunction("ABC")).toBe(true);
    expect(validator.validatorFunction("ABCD")).toBe(true);
    expect(validator.validatorFunction("AB")).toBe(false);
    expect(validator.validatorFunction("  AB  ")).toBe(false);
    expect(validator.validatorFunction(undefined)).toBe(false);
});

test("Validator createMaxLengthFormValidator", () => {
    const validator = fw.createMaxLengthFormValidator(3, 'max length');
    expect(validator.validatorFunction("AB")).toBe(true);
    expect(validator.validatorFunction("ABCDEF")).toBe(false);
    expect(validator.validatorFunction(undefined)).toBe(true);
});

test("Validator createEqLengthFormValidator", () => {
    const validator = fw.createEqLengthFormValidator(3, 'eq length');
    expect(validator.validatorFunction("AB")).toBe(false);
    expect(validator.validatorFunction("ABC")).toBe(true);
    expect(validator.validatorFunction("ABCDEF")).toBe(false);
    expect(validator.validatorFunction(undefined)).toBe(true);
});

test("Validator createRegexFormValidator", () => {
    const validator = fw.createRegexFormValidator('^\\d+$', 'regex');
    expect(validator.validatorFunction("AB")).toBe(false);
    expect(validator.validatorFunction("1234")).toBe(true);
    expect(validator.validatorFunction("1234a")).toBe(false);
    expect(validator.validatorFunction(undefined)).toBe(true);
});



