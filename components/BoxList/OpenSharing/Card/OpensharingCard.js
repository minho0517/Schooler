"use client"

import Link from 'next/link';
import styles from './OpensharingCard.module.css';
import {FaRegCommentDots, FaHashtag, FaUser} from "react-icons/fa6"

export default function OpensharingCard() {
    
    return (
        <Link className={styles.card} href='/'>
            <div className={styles.wrapper}>
                <div className={styles.top}>
                    <div className={styles.title}>
                        <p>-</p>
                    </div>
                    <div className={styles.activeUser}>
                        <FaUser size={12}/>
                        <span>-</span>
                    </div>
                </div>
                <div className={styles.tagList}>
                    <span className={styles.tag}><FaHashtag size={11}/>테스트</span>
                </div>
                <div className={styles.previewChat}>
                    <div className={styles.previewChat_wrapper}>
                        <p>현재 개발 중에 있습니다. 오픈셰어링은 각 게시물에서 참여할 수 있습니다</p>
                    </div>
                </div>
                <div className={styles.activeChat}>
                    <FaRegCommentDots size={18}/>
                    <span>-</span>
                </div>
            </div>
        </Link>
    )
}