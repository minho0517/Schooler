"use client"

import Link from "next/link";
import styles from "./login.module.css";
import { useState } from "react";
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import IntroImg from "@/public/image/schooler-logo-icon.png";

export default function Page() {

    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isLogining, setIsLogining] = useState(false)

    const onIdHandler = (event) => {
        setId(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const Login = async (e) => {
        if(!id) return alert("아이디를 입력해주세요");
        if(!password) return alert("비밀번호를 입력해주세요");

        setIsLogining(true)
        const response = await signIn("credentials", {
            id: id,
            password: password,
            redirect: false,
        });
        if(response.error) {
            alert('아이디 또는 비밀번호가 일치하지 않습니다');
            setId("");
            setPassword("")
            setIsLogining(false)
        } else {
            window.location.href = "/";
        }

    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <Image className={styles.logo} alt='logo' src={IntroImg}></Image>
            </div>
            <div className={styles.wrapper}>
                <div className={styles.inputWrapper}>
                    <span className={styles.inputTitle}>아이디</span>
                    <input onChange={onIdHandler} value={id} type="text" placeholder="아이디를 입력해주세요" className={styles.inputBox}></input>
                </div>
                <div className={styles.inputWrapper}>
                    <span className={styles.inputTitle}>비밀번호</span>
                    <input onChange={onPasswordHandler} value={password} type="password" placeholder="비밀번호를 입력해주세요" className={styles.inputBox}></input>
                </div>
                <button onClick={Login} className={styles.submitBtn}>{isLogining ? <div className={styles.loader}></div> : '로그인'}</button>
                <div className={styles.helpLink}>
                    <Link href="/user/seek/account">계정 찾기</Link>
                    <Link href="/user/seek/password">비밀번호 찾기</Link>
                </div>
            </div>  
            <div className={styles.moveLink}>
                <span>아직 계정이 없으시다면?</span>
                <Link href="/auth/register">회원가입하기</Link>
            </div>
        </div>
    )
}