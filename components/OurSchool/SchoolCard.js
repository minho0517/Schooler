
import { FaSchoolFlag, FaUser } from "react-icons/fa6";
import styles from "./SchoolCard.module.css";

export default function SchoolCard({data}) {

    return (
        <div className={styles.section}>
            <div className={styles.card}>
                <div className={styles.wrapper}>
                    <div className={styles.info}>
                        <div className={styles.head}>
                            <div className={styles.title}>
                                {/* <FaSchoolFlag size={22}/> */}
                                <h2>{data.schoolData.name}</h2>
                                <div className={styles.activeUser}>
                                    <FaUser size={14}/>
                                    <span>{data.countStudent}</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className={styles.subCard}>

            </div>
            <div className={styles.subCard}>

            </div>
        </div>
    )
}