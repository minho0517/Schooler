"use client"

import useObserver from "@/hooks/useObserver";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import styles from "./TagSharingList.module.css"
import Loader from "../Utils/Loader/Loader";
import SharingCard from "../Card/Sharing/SharingCard";
import BlankWrapper from "../Utils/Blank/BlankWrapper";
import axios from "axios";
import { useGetQuery } from "@/hooks/useGetQuery";

export default function TagSharingList({tag}) {

    const apiUrl = `/api/sharing/tag/${tag}?&type=전체`;
    const queryKey = ['get-TagSharingList', tag];
    
    const { data, isFetchingNextPage, hasNextPage, status, fetchNextPage } = useGetQuery({ apiUrl, queryKey })
 
    const bottom = useRef();

    const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage();

    useObserver({
        target: bottom,
        onIntersect,
    });

    return (
        <div className={styles.page}>
            <div className={styles.listWrapper}>
                {status === "loading" && <div className={styles.loadingWrapper}><Loader size={45} border={5} /></div>}
                {data?.pages.map((group, i) => (
                    <div className={styles.cardList} key={i}>
                        {group?.map((e, i) => (
                            <SharingCard key={i} data={e} />
                        ))}
                    </div>
                ))}
                {data?.pages[0].length === 0 && <BlankWrapper message={"당신의 일상이나 고민을 셰어해보세요!"} />}
            </div>
            {isFetchingNextPage && <div className={styles.loadingWrapper}><Loader size={45} border={5} /></div>}
            <div ref={bottom}></div>
        </div>
    )
}