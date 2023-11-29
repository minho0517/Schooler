
self.addEventListener("push", (event) => {
    const message = event.data?.json();
    const { title, body, url } = message;

    console.log(message)

    async function handlePushEvent() {
        await self.registration.showNotification(title, {
            body,
            badge : "/image/schooler-logo-icon.png",
            data: {
                click_action: url,
            },
        })
    }

    event.waitUntil(handlePushEvent())

});

// self.addEventListener('notificationclick', (event) => {
//     console.log('[Service Worker] notificationclick');
//     clients.openWindow(event.notification.data.link);
// });

// self.addEventListener('install', () => {
//     console.log('[Service Worker] install');
//     self.skipWaiting();
// });