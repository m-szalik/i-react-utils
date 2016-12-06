'use strict';

module.exports.__esModule = true;

var utilsFactory = require('./utils');
var fwFactory = require('./FormWizard');
var bcFactory = require('./Breadcrumbs');

module.exports.shallowCopy = utilsFactory.shallowCopy;
module.exports.shallowCopyExcept = utilsFactory.shallowCopyExcept;
module.exports.isEquivalent = utilsFactory.isEquivalent;
module.exports.isEmptyObject = utilsFactory.isEmptyObject;
module.exports.isNotBlank = utilsFactory.isNotBlank;
module.exports.setObjProperty = utilsFactory.setObjProperty;
module.exports.getObjProperty = utilsFactory.getObjProperty;
module.exports.isValidNIP = utilsFactory.isValidNIP;
module.exports.isValidREGON = utilsFactory.isValidREGON;
module.exports.isValidEmail = utilsFactory.isValidEmail;

module.exports.fw = {
    createFormValidator : fwFactory.createFormValidator,
    createIsRequiredFormValidator : fwFactory.createIsRequiredFormValidator,
    createMinLengthFormValidator : fwFactory.createMinLengthFormValidator,
    createMaxLengthFormValidator : fwFactory.createMaxLengthFormValidator,
    createEqLengthFormValidator : fwFactory.createEqLengthFormValidator,
    createRegexFormValidator : fwFactory.createRegexFormValidator,
    BootstrapWrapper : fwFactory.BootstrapWrapper,
    Input : fwFactory.Input,
    Form : fwFactory.Form
};
module.exports.GlobalMessage = require('./GlobalMessage');
module.exports.Breadcrumbs = bcFactory.Breadcrumbs;
module.exports.bc = bcFactory.bc;
module.exports.List = require('./List').List;
module.exports.AjaxList = require('./AjaxList');
module.exports.PasswordStrengthMeter = require('./PasswordStrengthMeter');
module.exports.LazyLoad = require('./LazyLoad');


// Polyfills:
if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        let k;
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        let o = Object(this);
        let len = o.length >>> 0;
        if (len === 0) {
            return -1;
        }
        let n = fromIndex | 0;
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in o && o[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}