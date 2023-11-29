"use client";

import React, { useEffect, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { registerServiceWorker } from "./serviceWorker";
import { getCurrentPushSubscription, registerPushNotifications } from "./notification/pushService";

function Providers({ children }) {

    const [client] = useState(new QueryClient());

    useEffect(() => {
        async function setUpServiceWorker() {
            try {
                await registerServiceWorker();
            } catch(err) {
                console.error(err);
            }
        }
        setUpServiceWorker();
    }, []);

    useEffect(() => {
        async function setPushEnabled() {
            const subscription = await getCurrentPushSubscription();
            try {
                if(!!subscription === false) {
                    await registerPushNotifications();
                } else {
                    return
                }
            } catch(err) {
                if(!!subscription && Notification.permission === "denied" ) {
                    return
                } else {
                    return
                }
            }
        }
        setPushEnabled();
    }, []);

  return (
    <QueryClientProvider client={client}>
        {children}
    </QueryClientProvider>
  );
}

export default Providers;