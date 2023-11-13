"use client"

import { useEffect, useState } from "react";
import styles from "./Modal.module.css";
import usePreventScroll from "@/hooks/usePreventScroll";

export default function ConfirmModal({ message, description, cancel, process, button}) {

    const [active, setActive] = useState(false);

    usePreventScroll()

    useEffect(() => {
        setActive(true)
    }, []);

    const cancelHandler = () => {
        setActive(false);
        setTimeout(() => cancel(), 200)
    }

    const processHandler = () => {
        cancel();
        process();
    }

    return (
        <div className={styles.modal}>
            <div className={styles.relativeWrapper}>
                <div onClick={cancelHandler} className={`${styles.modalWrapper} ${active && styles.active}`}></div>
                <div className={`${styles.box} ${active && styles.active}`}>
                    <div className={styles.wrapper}>
                        <div className={styles.message}>
                            <h4 className={styles.title}>{message}</h4>
                            <span className={styles.description}>{description}</span>
                        </div>
                        <div className={styles.btnGroup}>
                            <button onClick={cancelHandler} className={styles.button}>취소</button>
                            <button onClick={processHandler} className={`${styles.button} ${styles.deleteBtn}`}>{button ? button : "확인"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}