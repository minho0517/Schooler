import { getReadyServiceWorker } from "../serviceWorker";

export async function getCurrentPushSubscription() {
    const sw = await getReadyServiceWorker();
    if(!sw) {
        throw Error("서비스워커 지원안함")
    }
    return sw.pushManager.getSubscription();
} 

export async function registerPushNotifications() {
    if(!("PushManager" in window)) {
        throw Error ("Push Notifications are not supported by this browser");
    }

    const existingSubscription = await getCurrentPushSubscription();

    if(existingSubscription) {
        throw Error("Existing push subscription found")
    }

    const sw = await getReadyServiceWorker();

    const subscription = await sw.pushManager.subscribe({
        userVisibleOnly : true,
        applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    });
    await sendPushSubscriptionToServer(subscription);
}

export async function unregisterPushNotifications() {
    const existingSubscription = await getCurrentPushSubscription();

    if(!existingSubscription) {
        throw Error("No Existing push subscription found")
    }

    await deletePushSubscriptionFromServer(existingSubscription);

    await existingSubscription.unsubscribe();
}

export async function sendPushSubscriptionToServer(subscription) {
    
    const response = await fetch("/api/notification/subscribe", {
        method: "POST",
        body : JSON.stringify(subscription)
    });
    if(!response.status === 200) {
        throw Error("알림 정보 저장 실패")
    }

}

export async function deletePushSubscriptionFromServer(subscription) {
    const response = await fetch("/api/notification/subscribe", {
        method: "DELETE",
    });
    if(!response.status === 200) {
        throw Error("알림 정보 저장 실패")
    }
}