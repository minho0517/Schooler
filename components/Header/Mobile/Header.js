import styles from './Header.module.css';

import Link from 'next/link';
import { useEffect } from 'react';
import { FaHouse, FaPaperclip, FaCircleUser, FaRegSquarePlus } from 'react-icons/fa6'
import { IoGrid } from "react-icons/io5"

export default function MoblieHeader() {

    useEffect(() => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isIPhoneX = window.matchMedia('(min-width: 375px) and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)').matches;
        
            if (isIPhoneX && isIOS) {
                const header = document.querySelector('.header'); 
                header.classList.add('iphone');
            }
        }
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <li className={styles.menu}><Link href='/'><FaHouse size={23}/></Link></li>
                <li className={styles.menu}><Link href='/sharing/all'><IoGrid size={23}/></Link></li>
                <li className={`${styles.menu} ${styles.special}`}><Link href='/share'><FaRegSquarePlus size={27}/></Link></li>
                <li className={styles.menu}><Link href='/follow'><FaPaperclip size={23}/></Link></li>
                <li className={styles.menu}><Link href='/profile'><FaCircleUser size={23}/></Link></li>
            </div>
        </header>
    )
}

