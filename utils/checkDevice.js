"use client"

export default function checkDevice() {
    
    const varUA = navigator?.userAgent.toLowerCase();

    if (varUA.indexOf('android') > -1) {
        return 'Android'
    } else if ( varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 ||varUA.indexOf("ipod") > -1 ) {
        return 'IOS'
    } else {
        return 'Others'
    }
}