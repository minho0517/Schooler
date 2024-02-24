

import styles from "./Accounts.module.css"

export default function SettingSwitchBtn({ title, initValue, handler } ) {


    return (
        <div className={styles.section}>
            <div className={styles.setting}>
                <div className={styles.settingWrapper}>
                    <h4 className={styles.sectionTitle}>{title}</h4>
                    <label className={styles.checkSwitch}>
                        <input checked={initValue} onChange={handler} type="checkbox"></input>
                        <span className={styles.checkSlider}></span>
                    </label>
                </div>
            </div>
        </div>
    )
}