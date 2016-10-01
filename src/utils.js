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
    var nip_bez_kresek = nip.replace(/-/g,"");
    var reg = /^[0-9]{10}$/;
    if(reg.test(nip_bez_kresek) == false) {
        return false;
    } else {
        var dig = ("" + nip_bez_kresek).split("");
        var kontrola = (6 * parseInt(dig[0]) + 5 * parseInt(dig[1]) + 7 * parseInt(dig[2]) + 2 * parseInt(dig[3]) + 3 * parseInt(dig[4]) + 4 * parseInt(dig[5]) + 5 * parseInt(dig[6]) + 6 * parseInt(dig[7]) + 7 * parseInt(dig[8])) % 11;
        return parseInt(dig[9]) == kontrola;
    }
}

export function isValidREGON(regon) {
    //REGON is a 9 or 14 digit number. Last digit is control digit from equation:
    // [ sum from 1 to (9 or 14) (x[i]*w[i]) ] mod 11; where x[i] is pointed NIP digit and w[i] is pointed digit
    //from [8 9 2 3 4 5 6 7] for 9 and [2 4 8 5 0 9 7 3 6 1 2 4 8] for 14 digits.
    let n = regon.length;
    let w;
    let cd = 0; // Control digit (last digit)
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

