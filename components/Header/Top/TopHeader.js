"use client"

import { FaChevronLeft, FaMagnifyingGlass, FaRegComments } from "react-icons/fa6";
import styles from "./TopHeader.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationBtn from "@/components/Notification/Notification";
import { useEffect, useState } from "react";

function TopHeader({ isLogin }) {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const isScrolled = scrollTop > 0;
            setIsScrolled(isScrolled);
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
        
    return (
        <div className={`${styles.header} ${isScrolled && styles.sticky}`}>
            <div className={styles.wrapper}>
                <div className={styles.search_wrapper}>
                    {/* <div className={styles.search}>
                        <input type="text" className={styles.searchInput} placeholder="검색어를 입력해주세요"></input>
                        <button className={styles.searchBtn}><FaMagnifyingGlass size={18}/></button>
                    </div> */}
                </div>
                <div className={styles.util_wrapper}>
                    <button className={styles.utilBtn}><FaMagnifyingGlass size={24}/></button>
                    {isLogin === false ? "" : <><NotificationBtn />
                    <Link href={"/contact"} className={`${styles.utilBtn} ${styles.mobile}`}><FaRegComments size={32}/></Link></>}
                </div>
            </div>
        </div>
    )
}

function GoBackHeader() {

    const router = useRouter();

    const goBackHandler = () => {
        router.back();
    }

    return (
        <div className={styles.header}>
            <div className={styles.wrapper}>
                <div onClick={goBackHandler} className={styles.goBackBtn}><FaChevronLeft size={20}/></div>
            </div>
        </div>    
    )
}

function BlankTopHeader() {

    return (
        <div className={styles.header}>
            
        </div>
    )
}

export {TopHeader, BlankTopHeader, GoBackHeader};