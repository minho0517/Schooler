
self.addEventListener("push", (event) => {
    const message = event.data?.json();
    const { title, body, url } = message;

    async function handlePushEvent() {
        await self.registration.showNotification(title, {
            body,
            badge : "/image/schooler-logo-icon.png",
            data: {
                url: url,
            },
        })
    }

    event.waitUntil(handlePushEvent())

});

self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    notification.close();

    async function handlerNotificationClick() {
        const windowClients = await self.clients.matchAll({
            type : "window",
            includeUncontrolled : true,
        });

        const url = notification.data.url;

        if(windowClients.length > 0) {
            await windowClients[0].focus();
            if ('navigate' in windowClients[0]) {
                await windowClients[0].navigate(url);
            } else {
                windowClients[0].postMessage({ url: url });
            }
        } else {
            self.clients.openWindow(url);
        }
    }

    event.waitUntil(handlerNotificationClick())
});

// self.addEventListener('install', () => {
//     console.log('[Service Worker] install');
//     self.skipWaiting();
// });