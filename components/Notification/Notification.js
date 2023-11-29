"use client";

import { FaBell, FaRegBell } from "react-icons/fa6";
import styles from "./Notification.module.css";
import { useEffect, useState } from "react";
import { getCurrentPushSubscription } from "@/utils/notification/pushService";
import { useSession } from "next-auth/react";
import NotificationBox from "./Box/NotificationBox";

export default function NotificationBtn() {

    const token = useSession();

    const [open, setOpen] = useState(false);   

    const [hasSubscription, setHasSubscription] = useState();

    useEffect(() => {
        async function getActivePushSubscription() {
            const subscription = await getCurrentPushSubscription();
            setHasSubscription(!!subscription)
        }
        getActivePushSubscription();
    }, [open]);

    return (
        <div className={styles.container}>
            <button onClick={() => setOpen(!open)} className={styles.utilBtn}>{open ? <FaBell size={28}/> : <FaRegBell size={28}/>}</button>
            {open && <NotificationBox closeHandler={() => setOpen(!open)} subscription={hasSubscription} />}
        </div>
    )
}