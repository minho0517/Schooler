import { FaAngleRight } from "react-icons/fa6";
import styles from "./SchoolBox.module.css";
import { MdOutlineLunchDining } from "react-icons/md";

export default function SchoolLunchBox() {

    return (
        <div className={styles.box}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <span className={styles.titleIcon}><MdOutlineLunchDining size={20}/></span>
                        <span>오늘의 급식</span>
                    </div>
                    <div className={styles.moveBtn}><FaAngleRight size={18}/></div>
                </div>
                <div className={styles.list}>
                    <span className={styles.blank}>12월 13일 업데이트 예정</span>
                </div>
            </div>
        </div>
    )
}

