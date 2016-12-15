/**
 * Copy properties from src to dst
 * @param dst
 * @param src
 * @param acceptFunction = function(key, srcVal) decide if copy that key || array of keys to copy || undefined == copy all
 * @returns dst
 */
export function shallowCopy(dst, src, acceptFunction) {
    if (dst === undefined || dst === null) {
        throw 'Destination (dst) is null or undefined - ' + dst;
    }
    if (src === undefined || src === null) {
        throw 'Source (src) is null or undefined - ' + src;
    }
    if (Array.isArray(acceptFunction)) {
        const accept = acceptFunction;
        acceptFunction = function(key, srcVal) {
            return accept.indexOf(key) > -1;
        };
    }

    for (var key in src) {
        if (src.hasOwnProperty(key)) {
            let sourceVal =  src[key];
            if (acceptFunction === undefined || acceptFunction(key, sourceVal)) {
                dst[key] = sourceVal;
            }
        }
    }
    return dst;
}

/**
 * Copy all properties from src to dst except those listed in arrExcept
 * @param dst
 * @param src
 * @param arrExcept - list of keys to omit.
 * @returns dst
 */
export function shallowCopyExcept(dst, src, arrExcept) {
    let accFunc;
    if (arrExcept) {
        accFunc = function(key, srcVal) {
            return arrExcept.indexOf(key) == -1;
        };
    }
    return shallowCopy(dst, src, accFunc);
}


/**
 * If arguments are equal
 * (hint: null != undefined)
 */
export function isEquivalent(a, b) {
    if (a === b) {
        return true;
    }
    if ((a == undefined && b != undefined) || (a != undefined && b == undefined)) {
        return false;
    }
    if (typeof a == typeof b) {
        if (typeof a == 'object') {
            let aProps = Object.getOwnPropertyNames(a);
            let bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                let propName = aProps[i];
                if (!isEquivalent(a[propName], b[propName])) {
                    return false;
                }
            }
            return true;
        } else {
            return a == b;
        }
    }
    return false;
}

export function isEmptyObject(obj) {
    if (obj == null || obj == undefined) {
        return true;
    }
    for(var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}


export function isNotBlank(str) {
    return str != undefined && str != null && str != false && str.toString().trim().length > 0;
}

export function setObjProperty(obj, propertyPath, value) {
    if (obj === null || obj === undefined) {
        throw 'Target cannot be null nor undefined but was ' + obj;
    }
    if (typeof obj !== 'object') {
        throw 'Target must be an object but was ' + (typeof obj);
    }
    let paths = propertyPath.split('.');
    let op = obj;
    for(let i=0; i<paths.length -1; i++) {
        const path = paths[i];
        let on = op[path];
        if (on == undefined || on == null) {
            on = {};
            op[path] = on;
        }
        op = on;
    }
    let prop = paths[paths.length -1];
    op[prop] = value;
}

export function getObjProperty(obj, propertyPath) {
    if (obj === null || obj === undefined) {
        return undefined;
    }
    let paths = propertyPath.split('.');
    let o = obj;
    for(let i=0; i<paths.length; i++) {
        const path = paths[i];
        o = o[path];
        if (o == undefined || o == null) {
            return null;
        }
    }
    return o;
}



export function isValidNIP(nip) {
    var nipNoDashes = nip.replace(/-/g,"");
    var reg = /^[0-9]{10}$/;
    if(reg.test(nipNoDashes) == false) {
        return false;
    } else {
        var dig = ("" + nipNoDashes).split("");
        var check = (6 * parseInt(dig[0]) + 5 * parseInt(dig[1]) + 7 * parseInt(dig[2]) + 2 * parseInt(dig[3]) + 3 * parseInt(dig[4]) + 4 * parseInt(dig[5]) + 5 * parseInt(dig[6]) + 6 * parseInt(dig[7]) + 7 * parseInt(dig[8])) % 11;
        return parseInt(dig[9]) == check;
    }
}

export function isValidREGON(regon) {
    let n = regon.length;
    let w;
    let cd = 0; // Control digit
    let isOnlyDigit = /^\d+$/.test(regon);
    if ( (n !== 9 && n !== 14) || !isOnlyDigit || parseInt(regon) === 0) {
        return false;
    }
    if (n === 9) {
        w = [8, 9, 2, 3, 4, 5, 6, 7];
    } else {
        w = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
    }
    for (var i = 0; i<n-1; i++) {
        cd += w[i]*parseInt(regon.charAt(i));
    }
    cd %= 11;
    if ( cd === 10 ) {
        cd = 0;
    }
    return !( cd !== parseInt(regon.charAt(n-1)) );
}



export function isValidEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Execute callback only in dev mode
 * Example: devOnly(() => {console.log('Some dev message.');});
 * @param callback
 */
export function devOnly(callback) {
    if(process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        callback();
    }
}