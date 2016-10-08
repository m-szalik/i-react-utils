'use strict';

module.exports.__esModule = true;

var utils = require('./utils');
var fw = require('./FormWizard');

module.exports = utils;
module.exports.fw = fw;
module.exports.GlobalMessage = require('./GlobalMessage').default;
module.exports.Breadcrumbs = require('./Breadcrumbs').default;
module.exports.List = require('./List').default;
module.exports.AjaxList = require('./AjaxList').default;


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
