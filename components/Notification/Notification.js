"use client";

import { FaBell, FaRegBell } from "react-icons/fa6";
import styles from "./Notification.module.css";
import { useEffect, useState } from "react";
import { getCurrentPushSubscription } from "@/utils/notification/pushService";
import { useSession } from "next-auth/react";
import NotificationBox from "./Box/NotificationBox";
import axios from "axios";

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

    const [newExist, setNewExist] = useState(false);

    const fetchData = async () => {
        const response = await axios.get("/api/notification/new");
        const data = response.data;
        setNewExist(data.exist);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const openHandler = () => {
        setOpen(!open)
    }
    const closeHandler = () => {
        setOpen(!open)
        setNewExist(false)
    }
  

    return (
        <div className={styles.container}>
            <button onClick={openHandler} className={styles.utilBtn}>{open ? <FaBell size={28}/> : <FaRegBell size={28}/>}{newExist && <span className={styles.badge}></span>}</button>
            {open && <NotificationBox closeHandler={closeHandler} exist={newExist} subscription={hasSubscription} />}
        </div>
    )
}