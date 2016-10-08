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

