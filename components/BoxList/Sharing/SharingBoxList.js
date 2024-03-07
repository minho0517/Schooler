"use client";

import styles from "./SharingBox.module.css";
import { useRouter } from "next/navigation";
import { FaAngleRight } from "react-icons/fa6";
import { PiEyeBold, PiThumbsUpBold } from 'react-icons/pi';
import { FaRegComment } from 'react-icons/fa6';
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SharingBoxList() {

    const router = useRouter();

    const [data, setData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/sharing/list/home`);
            const data = await response.data;
            setData(data)
        }
        fetchData();
    }, [])


    const topicData = require("/public/data/topic.json");
    const topicList = topicData.slice(1,);
    
    return (
        <div className={styles.wrapper}>
            {topicList.map((e, i) => (
                <div key={i} className={`${styles.box} ${styles.home}`}>
                    <div className={styles.boxWrapper}>
                        <div onClick={() => router.push(`/sharing/all/${e.title}`)} className={styles.boxHeader}>
                            <div className={styles.topicTitle}><span>{e.title}</span></div>
                            <div className={styles.moveBtn}><FaAngleRight size={18}/></div>
                        </div>
                        <div className={styles.boxList}>
                            {!data && Array(5).fill(<div className={styles.item}></div>)}
                            {data?.find(item => item.topic === e.title)?.posts?.map((e, i) => (
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