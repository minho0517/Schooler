

import { useEffect, useState } from "react";
import styles from "./AuthNumber.module.css";
import axios from "axios";

export default function AuthNumberBox({ sendTime, email, nextSection }) {

    const [authNumber, setAuthNumber] = useState('');
    const onAuthNumberHandler = (event) => {
        const newAuthNubmer = event.target.value.replace(/\D/g, '')
        if(event.target.value.length === 6) event.target.blur();
        setAuthNumber(newAuthNubmer);
        authBtnHandler();
    }

    const [resendTime, setResendTime] = useState(sendTime);
    const [isResended, setIsResended] = useState(false)

    const [nowTime, setNowTime] = useState(new Date());
    const startTime = new Date(resendTime);
    const endTime = new Date(startTime.getTime() + 3 * 60000)
    const timeLeft = endTime - nowTime;

    const minutesLeft = Math.floor((timeLeft / 1000 / 60) % 60);
    const secondsLeft = Math.floor((timeLeft / 1000) % 60);
    const secondLeft = secondsLeft < 10 ? "0"+secondsLeft : secondsLeft;

    useEffect(() => {
        if(timeLeft > 0) {
            const interval = setInterval(() => {
                setNowTime(new Date());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, []);

    const resendHandler = () => {
        setIsResended(true);
        const data = {
            email : email,
        }
        axios.post('/api/auth/sendEmail', data)
        .then((res) => {
            if(res.data.success === false) {
                alert(res.data.msg)
            } else {
                setResendTime(new Date(res.data.createdAt));
            }
        });
    }

    const [authBtn, setAuthBtn] = useState(true);
    const [isAuthing, setIsAuthing] = useState(false);

    const authBtnHandler = () => {
        if(authNumber.length < 6) {
            setAuthBtn(true);
        } else {
            setAuthBtn(false)
        }
    }

    useEffect(() => {
        authBtnHandler();
    }, [authNumber])

    const authHandler = () => {
        setIsAuthing(true);
        const data = {
            email,
            authNumber,
        }
        axios.post(`/api/auth/number`, data)
        .then((res) => {
            if(res.data.auth === true) {
                nextSection();
            } else if(res.data.auth === false) {
                alert(res.data.msg);
            }
            setIsAuthing(false);
        })
    }

    return (
        <div className={styles.box}>
            <div className={styles.authHeader}>
                <h4 className={styles.authTitle}>인증번호 확인</h4>
                <span className={styles.sendInfo}><span>{email}</span> 로 보냄</span>
            </div>
            <div className={styles.authWrapper}>
                <div className={styles.authInput}>
                    <input type="text" onChange={onAuthNumberHandler} maxLength='6' value={authNumber} className={styles.authInputBox}></input>
                </div>
                <div className={styles.authInfo}>
                    <span className={styles.limitTime}>{timeLeft <= 0 ? "유효시간 만료됨" : [minutesLeft + ":" + secondLeft + " 남음"]}</span>
                    {isResended ? <span className={styles.isResended}>재발송되었습니다</span> : <button onClick={resendHandler} className={styles.resendBtn}>재발송</button>}
                </div>
            </div>
            
            <button onClick={authHandler} className={`${styles.submitBtn} ${authBtn && styles.disabled}`} disabled={authBtn || isAuthing}>{ isAuthing ? <div className={styles.loader}></div> : "인증확인" }</button>
        </div>
    )
}