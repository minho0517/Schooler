"use client"

import { BlankTopHeader, GoBackHeader } from "@/components/Header/Top/TopHeader";
import styles from "./myActivityLayout.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRotateLeft } from "react-icons/fa6";
import ReportCard from "@/components/MyActivity/Report/ReportCard";

export default function Layout({children}) {

    const pathname = usePathname();

    const menu = [
        {title : "전체", link : "all"},
        {title : "셰어링", link : "sharing"},
        {title : "좋아요", link : "likes"},
        {title : "댓글", link : "comments"},
        {title : "오픈셰어링", link : "opensharing"},
        {title : "우리학교", link : "school"},
        {title : "보관함", link : "archive"},
    ]

    return (
        <div className={styles.page}>
            <BlankTopHeader />
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <FaRotateLeft size={25} />
                        <span>활동 기록</span>
                    </div>
                </div>
                <div className={styles.sectionWrapper}>
                    <div className={styles.main}>
                        <div className={styles.menuWrapper}>
                            {menu.map((e, i) => (
                                <Link key={i} href={"/my_activity/" + e.link} className={`${styles.menu} ${pathname === `/my_activity/${e.link}` && styles.active}`}><span>{e.title}</span></Link>
                            ))}
                        </div>
                        {children}
                    </div>
                    <div className={styles.sub}>
                        <ReportCard />
                    </div>
                </div>
            </div>
        </div>
    )

}