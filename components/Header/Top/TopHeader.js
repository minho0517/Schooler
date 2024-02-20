"use client"

import { FaChevronLeft, FaMagnifyingGlass, FaRegComments, FaRegPaperPlane } from "react-icons/fa6";
import styles from "./TopHeader.module.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationBtn from "@/components/Notification/Notification";
import { useEffect, useState } from "react";
import IntroImg from "@/public/image/schooler-logo-icon.png";
import Image from "next/image";

function TopHeader({ isLogin, type }) {

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

    const pathname = usePathname()
        
    return (
        <div className={`${styles.header} ${isScrolled && styles.sticky}`}>
            <div className={styles.wrapper}>
                <div className={styles.search_wrapper}>
                    {/* <div className={styles.search}>
                        <input type="text" className={styles.searchInput} placeholder="검색어를 입력해주세요"></input>
                        <button className={styles.searchBtn}><FaMagnifyingGlass size={18}/></button>
                    </div> */}
                    {type === "sharing" ? 
                        <div className={styles.sharing_navbar}>
                            <Link className={`${styles.sharing_option} ${pathname.includes('/sharing/all') ? styles.active : ""}`} href="/sharing/all">전체</Link>
                            <hr className={styles.sharing_optionLine}></hr>
                            <Link className={`${styles.sharing_option} ${pathname.includes('/sharing/our_school') ? styles.active : ""}`} href="/sharing/our_school">우리학교</Link>
                        </div> :
                        <Link className={styles.title} href='/'>
                            <Image className={styles.logo} alt='logo' src={IntroImg}></Image>
                        </Link>
                    }
                </div>
                <div className={styles.util_wrapper}>
                    <div className={styles.utilBtn}><FaMagnifyingGlass size={24}/></div>
                    {isLogin === false ? "" : <><NotificationBtn />
                    <Link href={"/contact"} className={`${styles.utilBtn} ${styles.mobile}`}><FaRegPaperPlane size={24}/></Link></>}
                </div>
            </div>
        </div>
    )
}

function GoBackHeader({ title, button, url }) {

    const router = useRouter();

    const goBackHandler = () => {
        if(url?.length > 0) {
            router.push(url);
        } else {
            router.back();
        }
    }

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
                <div onClick={goBackHandler} className={styles.headerBtn}><div className={styles.gobackBtn}><FaChevronLeft size={20}/></div></div>
                <span className={styles.pageTitle}>{title}</span>
                <div className={styles.headerBtn}>{button}</div>
            </div>
        </div>    
    )
}

function TitleTopheader() {

    const router = useRouter();

    const goBackHandler = () => {
        router.back();
    }

    return (
        <div className={styles.header}>

        </div>   
    )

}

function BlankTopHeader() {

    const router = useRouter();

    const goBackHandler = () => {
        router.back();
    }

    return (
        <div className={styles.header}>
            <div className={styles.wrapper}>
                <div onClick={goBackHandler} className={styles.headerBtn}><div className={styles.gobackBtn}><FaChevronLeft size={20}/></div></div>
                <span className={styles.pageTitle}></span>
            </div>
        </div>
    )
}

export {TopHeader, BlankTopHeader, GoBackHeader, TitleTopheader};