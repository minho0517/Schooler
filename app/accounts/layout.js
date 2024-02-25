"use client";

import styles from './accountsLayout.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBullhorn, FaChevronLeft, FaRegBell, FaRegCircleUser, FaRegFlag, FaRegMoon, FaShieldHalved, FaUser } from 'react-icons/fa6';
import { GoBackHeader } from '@/components/Header/Top/TopHeader';

export default function AccountsLayout({ children }) {

    const menu = [
        {
            title : "프로필 편집",
            icon : <FaRegCircleUser size={20}/>,
            link : "/accounts/edit"
        },
        {
            title : "비밀번호 및 보안",
            icon : <FaShieldHalved size={20}/>,
            link : "/accounts/security"
        },
        {
            title : "알림",
            icon : <FaRegBell size={20}/>,
            link : "/accounts/notification"
        },
        {
            title : "다크 모드",
            icon : <FaRegMoon size={20}/>,
            link : "/accounts/darkmode"
        },
        {
            title : "개발 현황",
            icon : <FaBullhorn size={20}/>,
            link : "/accounts/report"
        },
    ]

    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className={`${styles.page} ${pathname === "/accounts" ? styles.menuPage : styles.chatPage}`}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.navbar}>
                        <div className={styles.titleHeader}>
                            <button onClick={() => router.push('/sharing/all')} className={styles.goBackBtn}><FaChevronLeft size={20} /></button>
                            <div className={styles.currentUser}><span>설정</span></div>
                        </div>
                        <div className={styles.mobileHeader}>
                            <GoBackHeader title={"설정"} button={<span></span>}/>
                        </div>  
                    </div>
                    <div className={styles.list}>
                        <div className={styles.listWrapper}>
                            {menu.map((e, i) => (
                                <Link href={e.link} key={i} className={`${styles.menuItem} ${pathname === e.link && styles.active}`}>
                                    {e.icon}
                                    <span>{e.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.settingContainer}>
                    {children}
                </div>
            </div>
        </div>
    )
}