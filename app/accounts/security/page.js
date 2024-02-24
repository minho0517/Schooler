

import { GoBackHeader } from "@/components/Header/Top/TopHeader";
import styles from "../accounts.module.css";

export default function Page() {


    return (
        <div className={styles.page}>
            <GoBackHeader title={"비밀번호 및 보안"} button={<span></span>} mobile={true}/>
            <div className={styles.wrapper}>
                <div className={styles.pageHeader}>
                    <h2 className={styles.pageTitle}>비밀번호 및 보안</h2>
                </div>
                <div className={styles.settingList}>
                    
                </div>
            </div>
        </div>
    )
}