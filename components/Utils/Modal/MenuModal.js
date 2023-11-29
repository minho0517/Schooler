
import { Fragment, useEffect, useState } from "react";
import styles from "./Modal.module.css";
import usePreventScroll from "@/hooks/usePreventScroll";
import Link from "next/link";


export default function MenuModal({menuList, cancel}) {

    const [active, setActive] = useState(false);

    usePreventScroll()

    useEffect(() => {
        setActive(true)
    }, []);

    const cancelHandler = (event) => {
        event.preventDefault()
        setActive(false);
        setTimeout(() => cancel(), 200)
    }


    return (
        <div className={styles.modal}>
            <div className={styles.relativeWrapper}>
                <div onClick={cancelHandler} className={`${styles.modalWrapper} ${active && styles.active}`}></div>
                <div className={`${styles.box} ${active && styles.active} ${styles.menuModal}`}>
                    <div className={styles.wrapper}>
                        {menuList.map((e, i) => (
                            <Fragment key={i}>
                            {e.component === "link" && <Link onClick={cancelHandler} href={e.link} className={styles.menuBtn} >{e.title}</Link> }
                            {e.component === "button" && <button onClick={e.handler} className={`${styles.menuBtn} ${e.type === "delete" && styles.redMenu}`}>{e.title}</button>}
                            <hr className={styles.menuUnderline}></hr>
                            </Fragment>                        
                        ))}
                        <button onClick={cancelHandler} className={styles.menuBtn}>취소</button>
                    </div>
                </div>
            </div>
        </div>
        
    )
}