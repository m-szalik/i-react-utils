import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import PSM from '../src/PasswordStrengthMeter';


test("PasswordStrengthMeter - minLen less", () => {
  const componentDefinition = (<PSM minLength={4} strengthThreshold={1} password="abc"/>);
  const component = TestUtils.renderIntoDocument(componentDefinition);
  const pb = TestUtils.scryRenderedDOMComponentsWithClass(component, 'progress-bar')[0];
  assert(pb.className.includes('progress-bar-danger'));
});

test("PasswordStrengthMeter - minLen more", () => {
  const componentDefinition = (<PSM minLength={4} strengthThreshold={1} password="abcbcz"/>);
  const component = TestUtils.renderIntoDocument(componentDefinition);
  const pb = TestUtils.scryRenderedDOMComponentsWithClass(component, 'progress-bar')[0];
  assert(! pb.className.includes('progress-bar-danger'));
  assert(pb.className.includes('progress-bar-warning'));
});

test("PasswordStrengthMeter - strong password", () => {
    const componentDefinition = (<PSM minLength={4} strengthThreshold={1} password="aPn_0y7KfoooBar"/>);
    const component = TestUtils.renderIntoDocument(componentDefinition);
    const pb = TestUtils.scryRenderedDOMComponentsWithClass(component, 'progress-bar')[0];
    assert(! pb.className.includes('progress-bar-danger'));
    assert(! pb.className.includes('progress-bar-warning'));
    assert(pb.className.includes('progress-bar-success'));
});

