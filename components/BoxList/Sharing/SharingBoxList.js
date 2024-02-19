"use client";

import { useGetQuery } from "@/hooks/useGetQuery";
import styles from "./SharingBox.module.css";
import { useRouter } from "next/navigation";
import { FaAngleRight, FaStar } from "react-icons/fa6";
import { PiEyeBold, PiThumbsUpBold } from 'react-icons/pi';
import { FaRegComment } from 'react-icons/fa6';
import Link from "next/link";

export default function SharingBoxList() {

    const router = useRouter();
    const topicData = require("/public/data/topic.json");
    const topicList = topicData.slice(1,)
    const iconList = {
        // "베스트" : <FaStar />,
        // "수다" : ,
        // "학교생활" : ,
        // "연애·썸" : ,
        // "인간관계" : ,
        // "공부·성적" : ,
        // "입시" : ,
        // "진로" : ,
        // "게임" : ,
        // "여가·취미" : ,
        // "학원" : ,
        // "쇼핑·소비" : ,
        // "스포츠" : ,
        // "흑역사" L ,
    }

    const apiUrl = "/api/sharing/list/home?";
    const queryKey = ['get-sharingHomeList'];
    const { data, fetchNextPage, status, isFetchingNextPage } = useGetQuery({ apiUrl, queryKey });
    
    return (
        <div className={styles.wrapper}>
            {topicList.map((e, i) => (
                <div key={i} className={`${styles.box} ${styles.home}`}>
                    <div className={styles.boxWrapper}>
                        <div onClick={() => router.push(`/sharing/all/${e.title}`)} className={styles.boxHeader}>
                            <div className={styles.topicTitle}>{iconList[e.title]}  <span>{e.title}</span></div>
                            <div className={styles.moveBtn}><FaAngleRight size={18}/></div>
                        </div>
                        <div className={styles.boxList}>
                            {status === "loading" && Array(5).fill(<div className={styles.item}></div>)}
                            {data?.pages[0].find(item => item.topic === e.title)?.posts.map((e, i) => (
                                <Link href={`/post/${e._id}`} className={styles.item} key={i}>
                                    <div className={styles.itemWrapper}>
                                        <div className={styles.title}>
                                            <span>{e.title}</span>
                                        </div>
                                        <div className={styles.activeGroup}>
                                            <div className={styles.activeRecord}>
                                                <PiEyeBold size={15}/>
                                                <span>{e.views}</span>
                                            </div>
                                            <div className={styles.activeRecord}>
                                                <PiThumbsUpBold size={15}/>
                                                <span>{e.likeitems.length}</span>
                                            </div>
                                            <div className={styles.activeRecord}>
                                                <FaRegComment size={15}/>
                                                <span>{e.commentitems.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}