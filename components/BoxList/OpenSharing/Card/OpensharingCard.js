"use client"

import Link from 'next/link';
import styles from './OpensharingCard.module.css';
import {FaRegCommentDots, FaHashtag, FaUser} from "react-icons/fa6"

export default function OpensharingCard({ data }) {
    
    return (
        <Link className={styles.card} href={'/contact/' + data._id}>
            <div className={styles.wrapper}>
                <div className={styles.top}>
                    <div className={styles.title}>
                        <p>{data.room.title}</p>
                    </div>
                    <div className={styles.activeUser}>
                        <FaUser size={12}/>
                        <span>{data.memberCount}</span>
                    </div>
                </div>
                <div className={styles.tagList}>
                    {data.room.hashtag.map((e, i) => (
                        <span key={i} className={styles.tag}><FaHashtag size={11}/>{e}</span>
                    ))}
                </div>
                <div className={styles.previewChat}>
                    <div className={styles.previewChat_wrapper}>
                        <p>{data.latestMessages[0] ? data.latestMessages[0].content : "오픈셰어링에 참여해보세요!"}</p>
                    </div>
                </div>
                <div className={styles.activeChat}>
                    <FaRegCommentDots size={15}/>
                    <span>{data.chatCount}</span>
                </div>
            </div>
        </Link>
    )
}