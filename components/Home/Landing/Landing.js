'use client'

import { FaDownload } from "react-icons/fa6";
import styles from "./Landing.module.css";
import { FaSignInAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Landing() {

    const router = useRouter();

    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = e => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
    
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt,
            );    
        };
    }, []);

    const handleDownload = async () => {
        if (!deferredPrompt) {
        return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
    };

    return (
        <div className={styles.landing}>
            <div className={styles.wrapper}>
                <div className={styles.titleHeader}>
                    <h2 className={styles.title}>안녕하세요, <span>스쿨러 알파테스트에 오신 걸 환영합니다!</span></h2>
                    <p className={styles.description}>모든 청소년을 위한 뉴커뮤니티 플랫폼으로서 커뮤니티의 진정한 의미를 실현시키며 새로운 패러다임의 커뮤니티 문화를 선도합니다</p>
                </div>
                <div className={styles.btnGroup}>
                    <button onClick={handleDownload} className={styles.button}>
                        <FaDownload size={18}/>
                        <span>앱 다운로드</span>
                    </button>
                    <button onClick={() => router.push("/auth/login")} className={styles.button}>
                        <FaSignInAlt size={18}/>
                        <span>로그인</span>
                    </button>
                </div>
            </div>
        </div>
    )
}