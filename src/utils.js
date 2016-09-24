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
    var reg = /^[0-9]{9}$/;
    if(reg.test(regon) == false) {
        return false;
    } else {
        var dig = (""+regon).split("");
        var kontrola = (8*parseInt(dig[0]) + 9*parseInt(dig[1]) + 2*parseInt(dig[2]) + 3*parseInt(dig[3]) + 4*parseInt(dig[4]) + 5*parseInt(dig[5]) + 6*parseInt(dig[6]) + 7*parseInt(dig[7]))%11;
        if(kontrola == 10) kontrola = 0;
        return parseInt(dig[8])==kontrola;
    }
}


export function isValidEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


export function isNotBlank(str) {
    return str != undefined && str != null && str != false && str.trim().length > 0;
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

