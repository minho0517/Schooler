"use client";

import { FaAngleRight, FaBullhorn, FaRegComment, FaSchool } from "react-icons/fa6";
import styles from "./SchoolBox.module.css";
import { useGetQuery } from "@/hooks/useGetQuery";
import Link from "next/link";
import { PiEyeBold, PiThumbsUpBold } from "react-icons/pi";
import { useRouter } from "next/navigation";

export default function SchoolSharingBox({ school : { schoolName, schoolCode } }) {
    
    const router = useRouter();

    const apiUrl = `/api/sharing/list/ourSchool?topic=전체&page=1`;
    const queryKey = ['get-schoolSharing'];
    const { data, fetchNextPage, status, isFetchingNextPage } = useGetQuery({ apiUrl, queryKey });

    return ( 
        <div className={styles.box}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <span className={styles.titleIcon}><FaBullhorn size={16}/></span>
                        <span>우리학교</span>
                        <span className={styles.schoolName}>{schoolName}</span>
                    </div>
                    <div className={styles.moveBtn} onClick={() => router.push('/sharing/our_school/')}><FaAngleRight size={18}/></div>
                </div>
                <div className={styles.list}>
                    {!data && Array(4).fill(<div className={styles.sharingItem}></div>)}
                    {data?.pages[0].slice(0,4).map((e, i) => (
                        <Link href={`/post/${e._id}`} className={styles.sharingItem} key={i}>
                            <div className={styles.sharingItemWrapper}>
                                <div className={styles.sharingTitle}>
                                    <span>{e.title}</span>
                                </div>
                                <div className={styles.activeGroup}>
                                    <div className={styles.activeRecord}>
                                        <PiEyeBold size={15}/>
                                        <span>{e.views}</span>
                                    </div>
                                    <div className={styles.activeRecord}>
                                        <PiThumbsUpBold size={15}/>
                                        <span>{e.likes.length}</span>
                                    </div>
                                    <div className={styles.activeRecord}>
                                        <FaRegComment size={15}/>
                                        <span>{e.comments.length}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

