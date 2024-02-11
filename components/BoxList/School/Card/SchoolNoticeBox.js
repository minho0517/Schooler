import { FaAngleRight, FaBullhorn, FaSchool } from "react-icons/fa6";
import styles from "./SchoolBox.module.css";

export default function SchoolNoticeBox({ school : { schoolName, schoolCode } }) {

    return ( 
        <div className={styles.box}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <span className={styles.titleIcon}><FaBullhorn size={16}/></span>
                        <span>우리학교 소식</span>
                        <span className={styles.schoolName}>{schoolName}</span>
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

