import checkDevice from '@/utils/checkDevice';
import styles from './Header.module.css';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHouse, FaPaperclip, FaCircleUser, FaRegSquarePlus } from 'react-icons/fa6'
import { IoGrid } from "react-icons/io5"

export default function MoblieHeader() {

    const [device, setDevice] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const device = checkDevice();
        setDevice(device);
    }, []);

    const handleFullScreenChange = () => {
        const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        if (isFullScreen) {
            setIsFullScreen(true)
        } else {
            setIsFullScreen(false)
        }
    };
        
    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);

    return (
        <header className={`${styles.header} ${device === "IOS" && isFullScreen && styles.ios}`}>
            <div className={styles.wrapper}>
                <li className={styles.menu}><Link href='/'><FaHouse size={23}/></Link></li>
                <li className={styles.menu}><Link href='/sharing/all'><IoGrid size={23}/></Link></li>
                <li className={`${styles.menu} ${styles.special}`}><Link href='/share'><FaRegSquarePlus size={27}/></Link></li>
                <li className={styles.menu}><Link href='/'><FaPaperclip size={23}/></Link></li>
                <li className={styles.menu}><Link href='/profile'><FaCircleUser size={23}/></Link></li>
            </div>
        </header>
    )
}

