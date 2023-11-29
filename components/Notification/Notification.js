"use client";

import { FaBell, FaChevronLeft, FaRegBell } from "react-icons/fa6";
import styles from "./Notification.module.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { getCurrentPushSubscription, registerPushNotifications, unregisterPushNotifications } from "@/utils/notification/pushService";
import { useGetQuery } from "@/hooks/useGetQuery";
import NotificationCard from "./Card/NotificationCard";
import Loader from "../Utils/Loader/Loader";
import BlankWrapper from "../Utils/Blank/BlankWrapper";
import useObserver from "@/hooks/useObserver";
import usePreventScroll from "@/hooks/usePreventScroll";

export default function NotificationBtn() {

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

function NotificationBox({subscription, closeHandler}) {

    const [active, setActive] = useState(false);
    const [hasSubscription, setHasSubscription] = useState(subscription);

    const enabledHandler = (event) => {
        setHasSubscription(event.target.checked)
        setPushEnabled(event.target.checked)
    }

    useEffect(() => {
        setActive(true)
    }, []);

    async function setPushEnabled(enabled) {
        try {
            if(enabled) {
                await registerPushNotifications();
            } else {
                await unregisterPushNotifications();
            }
            setHasSubscription(enabled);
        } catch(err) {
            console.log(err)
            if(enabled && Notification.permission === "denied" ) {
                alert("브라우저 알람 권한을 허용해주세요")
            } else {
                alert("문제가 발생했습니다")
            }
        }
    }

    if(hasSubscription === undefined) return null;

    const apiUrl = `/api/notification/list?`;
    const queryKey = ['get-Notification'];
    const { data, fetchNextPage, status, isFetchingNextPage } = useGetQuery({ apiUrl, queryKey });

    const bottom = useRef();

    const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage();

    useObserver({
        target: bottom,
        onIntersect,
    });

    usePreventScroll()


    return (
        <div className={`${styles.box} ${active && styles.open}`}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <span className={styles.title}>
                        <div onClick={closeHandler} className={styles.goBackBtn}><FaChevronLeft size={20}/></div>
                        알림
                    </span>
                    <div className={styles.setting}>
                        <label className={styles.checkSwitch}>
                            <input checked={hasSubscription} onChange={enabledHandler} type="checkbox"></input>
                            <span className={styles.checkSlider}></span>
                        </label>
                    </div>
                </div>
                <div className={styles.list}>
                    <div className={styles.listWrapper}>
                        {status === "loading" && <Loader size={30} border={3} />}
                        {data?.pages.map((page, i) => (
                            <Fragment key={i}>
                                {page.map((e, i) => (
                                    <NotificationCard key={i} data={e}/>
                                ))}
                            </Fragment>
                        ))}
                        {data?.pages[0].length === 0 && <BlankWrapper size={15} message={"알림이 존재하지 않습니다"} />}
                        {isFetchingNextPage && <Loader size={30} border={3} />}
                        <div ref={bottom}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}