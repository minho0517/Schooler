"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./Accounts.module.css"
import axios from "axios";

export default function SettingTextInput({ title, initValue, disabled, regExp }) {


    const input = useRef(null)
    const [off, setOff] = useState(true);
    const [submitBtn, setSubmitBtn] = useState(true);

    const [newValue, setNewValue] = useState({ value : initValue, vaildate : null });

    const activeHandler = () => {
        setOff(false);
        setTimeout(() => {
            input.current.focus()
        }, 100);
    }
    const cancelHandler = () => {
        setNewValue({ value : initValue, vaildate : null })
        setOff(true);
    }

    const onFocusHandler = (event) => {
        event.target.selectionStart = event.target.value.length;
    }

    const newRegExp = new RegExp(regExp);

    const onChangeHandler = (event) => {
        setNewValue({ value : event.target.value.replace(/\s+/g, ''), vaildate : newRegExp.test(event.target.value)});
        submitBtnHandler();
    }

    const submitBtnHandler = () => {
        if(newValue.value && newValue.vaildate && newValue.value !== initValue) {
            setSubmitBtn(false)
        } else {
            setSubmitBtn(true)
        }
    }
    useEffect(() => {   
        submitBtnHandler();
    }, [newValue.vaildate, newValue.value])

    const [loading, setLoading] = useState(false);

    const changeHandler = () => {
        setLoading(true);
        if(!newValue.vaildate) return;
        const data = {
            id : newValue.value
        }

        axios.post('/api/accounts/id', data)
        .then((res) => {
            setLoading(false);
            setOff(true)
            
        }).catch((err) => {
            alert(err.response.data.msg);
            setNewValue({ value : initValue, vaildate : null})
            setLoading(false);
            setOff(true)
        })
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>{title}</h4>
            </div>
            <div className={`${styles.setting} ${disabled && styles.disabled}`}>
                <div className={styles.settingWrapper}>
                    <input ref={input} disabled={off} value={newValue.value} onChange={onChangeHandler} placeholder="4자 이상 20자 이하" className={styles.textInput} onFocus={onFocusHandler} ></input>
                    {!off && <div onClick={cancelHandler} className={styles.cancelBtn}><span>취소</span></div> }
                    {!disabled && <button disabled={submitBtn && !off} onClick={off ? activeHandler : changeHandler} className={styles.actionBtn}>
                        {loading ? <div className={styles.loader}></div> : <span>{ !off ? "변경 확인" : `${title} 변경`}</span>}
                    </button>}
                </div>
            </div>
        </div>
    )
}  