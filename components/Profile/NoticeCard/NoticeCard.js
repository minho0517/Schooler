"use client";

import BlankWrapper from "@/components/Utils/Blank/BlankWrapper";
import styles from "./NoticeCard.module.css";

export default function NoticeCard() {

    

    return (
        <div className={styles.card}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h4 className={styles.title}>알림</h4>
                </div>
                <div className={styles.noticeContainer}>
                    <BlankWrapper size={15} weight={500} message={"알림이 없습니다"} />
                </div>
            </div>
        </div>
    )
}