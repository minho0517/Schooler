
import styles from "./TagNav.module.css";
import { FaHashtag, FaSort } from "react-icons/fa6";

export default function TagNav({tag, count}) {

    return (
        <div className={styles.header}>
            <div className={styles.title}>
                <div className={styles.tag}><FaHashtag size={22}/><h3>{tag}</h3></div>   
            </div>
            <div className={styles.content}>
                <div className={styles.result}>
                    <div className={styles.resultTag}><FaHashtag size={15}/><span>{tag}</span></div>
                    <span className={styles.resultLabel}>태그결과 ({count})</span>
                </div>
                <div className={styles.filter_btn}>
                    <FaSort size={13} />
                    <span id={styles.filter_mode}>최신순</span>
                </div>
            </div>
        </div>
    )

}