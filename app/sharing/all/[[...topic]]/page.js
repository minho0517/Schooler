"use client"

import SharingCard from '@/components/Card/Sharing/SharingCard';
import styles from './all.module.css';
import { useRef } from 'react';
import useObserver from '@/hooks/useObserver';
import BlankWrapper from '@/components/Utils/Blank/BlankWrapper';
import Loader from '@/components/Utils/Loader/Loader';
import { useGetQuery } from '@/hooks/useGetQuery';

export default function Page({params}) {

    const topic = params.topic;

    const apiUrl = `/api/sharing/list/all?topic=${topic === undefined ? "전체" : topic}`
    const queryKey = ['get-sharingList', topic];

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage, status } = useGetQuery({ apiUrl, queryKey });

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
