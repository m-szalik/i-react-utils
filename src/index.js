'use strict';

module.exports.__esModule = true;

var utils = require('./utils');
var fw = require('./FormWizard');
var bcFactory = require('./Breadcrumbs');

module.exports = utils;
module.exports.fw = fw;
module.exports.GlobalMessage = require('./GlobalMessage');
module.exports.Breadcrumbs = bcFactory.Breadcrumbs;
module.exports.bc = bcFactory.bc;
module.exports.List = require('./List');
module.exports.AjaxList = require('./AjaxList');


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
