"use client";

import { FaAngleRight } from "react-icons/fa6";
import styles from "./SchoolBox.module.css";
import { TbCalendarTime } from "react-icons/tb";
import { useGetQuery } from "@/hooks/useGetQuery";

export default function SchoolTimetableBox() {

    const apiUrl = `/api/school/info/timetable?`;
    const queryKey = ['get-schoolTimetable'];
    const { data, fetchNextPage, status, isFetchingNextPage } = useGetQuery({ apiUrl, queryKey });

    return (
        <div className={styles.box}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <span className={styles.titleIcon}><TbCalendarTime size={20}/></span>
                        <span>오늘의 시간표</span>
                    </div>
                    <div className={styles.moveBtn}><FaAngleRight size={18}/></div>
                </div>
                <div className={styles.list}>
                    {data?.pages[0].length === 0 &&<span className={styles.blank}>시간표 정보 없음</span>}
                </div>
            </div>
        </div>
    )
}

