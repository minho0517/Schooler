
export async function registerServiceWorker() {
    if(!("serviceWorker" in navigator)) {
        throw Error("서비스워커 지원안함")
    }
    await navigator.serviceWorker.register("/serviceWorker.js");
}

export async function getReadyServiceWorker() {
    if(!("serviceWorker" in navigator)) {
        throw Error("서비스워커 지원안함")
    }
    return navigator.serviceWorker.ready;
}