import Link from 'next/link';
import styles from './LivechatCard.module.css';
import {FaRegCommentDots, FaHashtag, FaUser} from "react-icons/fa6"

export default function LivechatCard() {
    
    return (
        <Link className={styles.card} href='/'>
            <div className={styles.wrapper}>
                <div className={styles.top}>
                    <div className={styles.title}>
                        <p>MBTI 과몰입</p>
                    </div>
                    <div className={styles.activeUser}>
                        <FaUser size={12}/>
                        <span>87</span>
                    </div>
                </div>
                <div className={styles.tagList}>
                    <span className={styles.tag}><FaHashtag size={11}/>MBTI</span>
                    <span className={styles.tag}><FaHashtag size={11}/>엠비티아이</span>
                    <span className={styles.tag}><FaHashtag size={11}/>과몰입에대하여</span>
                    <span className={styles.tag}><FaHashtag size={11}/>아무나들어와봐</span>
                    <span className={styles.tag}><FaHashtag size={11}/>난ENTJ</span>
                </div>
                <div className={styles.previewChat}>
                    <div className={styles.previewChat_wrapper}>
                        <p> 근데 엠비티아이 맞는 부분이 꽤 많던데? 다 그런건 아니지만 각 유형마다 공통적인 특성이 있어</p>
                    </div>
                </div>
                <div className={styles.activeChat}>
                    <FaRegCommentDots size={18}/>
                    <span>1.9천</span>
                </div>
            </div>
        </Link>
    )
}