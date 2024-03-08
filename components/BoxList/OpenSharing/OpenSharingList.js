"use client";

import { useGetQuery } from "@/hooks/useGetQuery";
import OpensharingCard from "./Card/OpensharingCard";
import styles from "./OpenSharingList.module.css";

export default function OpenSharingList() {

    const apiUrl = `/api/contact/home?`;
    const queryKey = ['get-opensharingList'];
    const { data, fetchNextPage, status, isFetchingNextPage } = useGetQuery({ apiUrl, queryKey });
    return (
        <div className={styles.wrapper}>
            <div className={styles.list}>
                {data?.pages[0].map((e, i) => (
                    <OpensharingCard data={e} key={i} />
                ))}
                {!data && Array(5).fill(<div className={styles.item}></div>) }
            </div>
        </div>
    )
}