import styles from './Header.module.css';
import Link from 'next/link';
import { FaHouse, FaPaperclip, FaCircleUser, FaRegSquarePlus } from 'react-icons/fa6'
import { IoGrid } from "react-icons/io5"

export default function MoblieHeader() {

    return (
        <header className={`${styles.header}`}>
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

