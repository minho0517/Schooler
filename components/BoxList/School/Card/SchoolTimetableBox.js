import { FaAngleRight } from "react-icons/fa6";
import styles from "./SchoolBox.module.css";
import { TbCalendarTime } from "react-icons/tb";

export default function SchoolTimetableBox() {

    return (
        <div className={styles.box}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <span className={styles.titleIcon}><TbCalendarTime size={20}/></span>
                        <span>오늘의 시간표</span>
                    </div>
                    <div className={styles.moveBtn}><FaAngleRight size={18}/></div>
                </div>
                <div className={styles.list}>
                    <span className={styles.blank}>2월 24일 업데이트 예정</span>
                </div>
            </div>
        </div>
    )
}

