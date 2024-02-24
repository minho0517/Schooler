"use client"

import { getCurrentPushSubscription, registerPushNotifications, unregisterPushNotifications } from "@/utils/notification/pushService";
import styles from "../accounts.module.css";
import { useEffect, useState } from "react";
import SettingSwitchBtn from "@/components/Accounts/SettingSwitchBtn";
import { GoBackHeader } from "@/components/Header/Top/TopHeader";

export default function Page() {

    const [active, setActive] = useState(false);
    const [hasSubscription, setHasSubscription] = useState(true);

    useEffect(() => {
        async function getActivePushSubscription() {
            const subscription = await getCurrentPushSubscription();
            setHasSubscription(!!subscription)
        }
        getActivePushSubscription();
    }, []);

    const enabledHandler = (event) => {
        setHasSubscription(event.target.checked)
        setPushEnabled(event.target.checked)
    }

    async function setPushEnabled(enabled) {
        try {
            if(enabled) {
                await registerPushNotifications();
            } else {
                await unregisterPushNotifications();
            }
            setHasSubscription(enabled);
        } catch(err) {
            if(enabled && Notification.permission === "denied" ) {
                alert("브라우저 알람 권한을 허용해주세요");
            } else {
                alert("문제가 발생했습니다");
            }
        }
    }


    return (
        <div className={styles.page}>
            <GoBackHeader title={"알림"} button={<span></span>} mobile={true}/>
            <div className={styles.wrapper}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>알림</h2>
                </div>
                <div className={styles.settingList}>
                    <SettingSwitchBtn title={"푸시 알림"} initValue={hasSubscription} handler={enabledHandler}/>
                </div>
            </div>
        </div>
    )
}