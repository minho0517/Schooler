"use client";

import { FaRegComment } from "react-icons/fa6";
import styles from "./NotificationCard.module.css";
import { PiThumbsUpBold } from "react-icons/pi";
import { identify } from "@/utils/identity";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationCard({ data }) {

    const [type, setType] = useState(data.type);

    const router = useRouter();

    return (
        <div onClick={() => router.push(data.url)} className={styles.card}>
            <div className={styles.wrapper}>
                <div className={styles.type}>
                    {type.includes("Like") && <PiThumbsUpBold size={20}/> }
                    {type.includes("Comment") && <FaRegComment size={20}/> }
                </div>
                <div className={styles.content}>
                    {data.body && <span className={styles.title}>
                        {new identify(data.body).text(23)}
                    </span>}
                    <p className={styles.description}>
                        {new identify(data.title).text(40)}
                    </p>
                </div>
                <span className={styles.timeInfo}>{new identify(data.createdAt).pastTime()}</span>
            </div>
        </div>
    )
}