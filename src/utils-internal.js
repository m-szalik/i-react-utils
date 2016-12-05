/*
 * Not exported as public functions of this library.
 */

import React from 'react';



export function _buildElement(compOrElem, props, children) {
    if (compOrElem) {
        if (React.isValidElement(compOrElem)) {
            return compOrElem;
        } else {
            return React.createElement(compOrElem, props, children);
        }
    } else {
        return null;
    }
}

export function devOnly(callback) {
    if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        callback();
    }
}