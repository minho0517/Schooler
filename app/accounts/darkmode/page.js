"use client";

import { GoBackHeader } from "@/components/Header/Top/TopHeader";
import styles from "../accounts.module.css";
import SettingSwitchBtn from "@/components/Accounts/SettingSwitchBtn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

    const router = useRouter();

    const [dark, setDark] = useState();

    useEffect(()=>{
        const theme = ('; '+document.cookie).split(`; mode=`).pop().split(';')[0]
        if (theme === '') {
            document.cookie = 'mode=light; max-age=' + (3600 * 24 * 400)
        }
        setDark(theme === "dark" ? true : false)
    },[]);

    const buttonHandler = () => {
        if (!dark) {
            document.cookie = 'mode=dark; max-age=' + (3600 * 24 * 400)
            setDark(true)
        } else {
            document.cookie = 'mode=light; max-age=' + (3600 * 24 * 400)
            setDark(false)
        }
        router.refresh();
    }

    return (
        <div className={styles.page}>
            <GoBackHeader title={"화면테마"} button={<span></span>} mobile={true}/>
            <div className={styles.wrapper}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>화면테마</h2>
                </div>
                <div className={styles.settingList}>
                    <SettingSwitchBtn title={"다크모드"} initValue={dark} handler={buttonHandler}/>
                </div>
            </div>
        </div>
    )
}