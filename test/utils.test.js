import assert from "assert";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from 'react-addons-test-utils';
import {isNotBlank,isEmptyObject,setObjProperty,getObjProperty, isValidNIP, isValidREGON, isValidEmail} from '../src/index';


describe("Utils - isNotBlank", function() {
    this.timeout(100);

    it("isNotBlank empty string", () => {
        assert(isNotBlank("") === false, 'Wrong result for empty string');
    });
    it("isNotBlank white string", () => {
        assert(isNotBlank("  ") === false, 'Wrong result for white string');
    });
    it("isNotBlank null or undefined", () => {
        assert(isNotBlank(null) === false, 'Wrong result for null');
        assert(isNotBlank(undefined) === false, 'Wrong result for undefined');
    });
    it("isNotBlank text", () => {
        assert(isNotBlank('text'), 'Wrong result for "text"');
    });
    it("isNotBlank object", () => {
        assert(isNotBlank({}), 'Wrong result for object');
    });
});


describe("Utils - isEmptyObject", function() {
    this.timeout(100);

    it("isEmptyObject for null / undefined", () => {
        assert(isEmptyObject(null), 'Wrong result for null');
        assert(isEmptyObject(undefined), 'Wrong result for undefined');
    });
    it("isEmptyObject for {}", () => {
        assert(isEmptyObject({}), 'Wrong result for {}');
    });
    it("isEmptyObject for {prop:12}", () => {
        assert(isEmptyObject({prop:12}) === false, 'Wrong result for {prop:12}');
    });

});

describe("Utils - setObjProperty", function() {
    this.timeout(100);

    it("setObjProperty - target null", () => {
        try {
            setObjProperty(null, "a.b", 14);
        } catch (err) {
            return;
        }
        assert.fail('Exception was expected');
    });
    it("setObjProperty - value 17", () => {
        let target = {};
        setObjProperty(target, "a.b", 17);
        assert(target.a.b === 17, 'Wrong value');
    });
});

describe("Utils - getObjProperty", function() {
    this.timeout(100);

    it("getObjProperty - source null", () => {
        assert(getObjProperty(null, "a.b") === undefined, "Expecting undefined");
    });
    it("getObjProperty - value 119", () => {
        assert(getObjProperty({a:{b:119}}, "a.b") === 119, "Value expected");
    });
});

describe("Utils - validators", function() {
    this.timeout(100);

    it("isValidNIP", () => {
        assert(isValidNIP('8196895375'));
        assert(! isValidNIP('98236'));
    });

    it("isValidREGON", () => {
        assert(! isValidREGON('12345678'));
        assert(isValidREGON('650404553')); // 9 digits
        assert(isValidREGON('19543451407739')); // 14 digits
    });

    it("isValidEmail", () => {
        assert(! isValidEmail('somebody@somewhere.a'));
        assert(isValidEmail('somebody@somewhere.dot'));
    });
});