import Link from 'next/link';
import styles from './SharingCard.module.css';
import { PiEyeBold, PiThumbsUpBold } from 'react-icons/pi';
import { identify } from '@/utils/identity';
import { useEffect, useState } from 'react';
import { FaBookmark, FaRegBookmark, FaRegComment } from 'react-icons/fa6';
import axios from 'axios';

export default function SharingCard({data}) {

    const [isBookmarked, setIsBookmarked] = useState(data.isBookmark);

    useEffect(() => {
        setIsBookmarked(data.isBookmark)
    }, [data.isBookmark]);

    const bookmarkBtnHandler = (event) => {
        event.preventDefault();
    
        if(isBookmarked) {
            setIsBookmarked(false);
        } else {
            setIsBookmarked(true);
        }

        axios.post(`/api/post/${data._id}/bookmark`)
    }

    return (
        <div className={`${styles.card} ${styles.main}`}>
            <Link href={'/post/' + data._id} className={styles.wrapper}>
                <div className={styles.head}>
                    <span className={styles.topic}>{data.topic}</span>
                </div>
                <div className={styles.content}>
                    <h4 className={styles.title}>{data.title}</h4>
                    <p className={styles.previewContent}>{data.content.slice(0,200)}</p>
                </div>
                <div className={styles.info}>
                    <div className={styles.writer}>                    
                        <span className={styles.pastTime}>{new identify(data.createdAt).pastTime()}</span> 
                        {data.user_id.id} &#183; {data.user_id.school.schoolName}
                    </div>
                    <div className={styles.activeGroup}>
                        <div className={styles.activeRecord}>
                            <PiEyeBold size={15}/>
                            <span>{data.views}</span>
                        </div>
                        <div className={styles.activeRecord}>
                            <PiThumbsUpBold size={15}/>
                            <span>{data.likes.length}</span>
                        </div>
                        <div className={styles.activeRecord}>
                            <FaRegComment size={15}/>
                            <span>{data.comments.length}</span>
                        </div>
                    </div>
                </div>
            </Link>
            <button onClick={bookmarkBtnHandler} className={`${styles.bookmarkBtn} ${isBookmarked && styles.active}`}>{isBookmarked ? <FaBookmark size={20}/> : <FaRegBookmark size={20}/>}</button>
        </div>
    )
}