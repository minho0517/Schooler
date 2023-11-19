"use client"

import styles from "./ChatHeader.module.css";
import { IoInformationCircleOutline } from "react-icons/io5";
import { identify } from "@/utils/identity";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function ChatHeader({data, id}) {

    const router = useRouter();

    return (
        <div className={styles.header}>
            <div className={styles.move}>
                <button onClick={() => router.push('/contact')} className={styles.goBackBtn}><FaChevronLeft size={20}/></button>
            </div>
            <Link href={`/post/${id}`} className={styles.roomInfo}>
                <div className={styles.main}>
                    <div className={styles.titleInfo}>
                        <span className={styles.topic}>{data.opensharing.topic}</span>
                        <h4 className={styles.title}>{new identify(data.opensharing.title).text(20)}</h4>
                    </div>
                    <span className={styles.pastTime}>{new identify(data.opensharing.createdAt).pastTime()}</span>
                </div>
                <div className={styles.sub}>
                    <p className={styles.content}>{String(data.opensharing.content).split("\n")[0]} {String(data.opensharing.content).split("\n").length > 1 && "..."} </p>
                </div>
            </Link>
            <div className={styles.headerBtnGroup}>
                <button className={styles.roomInfoBtn}><IoInformationCircleOutline size={28}/></button>
            </div>
        </div>
    )
}