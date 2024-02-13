import styles from './Header.module.css';

import Link from 'next/link';
import { FaRegComment, FaHouse, FaRegPaperPlane, FaPaperclip, FaRegCalendar, FaCircleUser, FaRotateLeft, FaGear, FaHeadset, FaCircleInfo, FaRegSquarePlus } from 'react-icons/fa6'
import { IoGrid } from 'react-icons/io5';

export default function Header() {
    return (
    <header className={styles.header}>
        <div className={styles.wrapper}>
            <div className={styles.title}>
                <Link href='/'>스쿨러</Link>
            </div>
            <div className={styles.menu_list}>
                <li className={styles.menu}><Link href='/'><FaHouse size={23}/><span>홈</span></Link></li>
                <li className={styles.menu}><Link href='/sharing/all'><IoGrid size={23}/><span>셰어링</span></Link></li>
                <li className={styles.menu}><Link href='/contact'><FaRegPaperPlane size={23}/><span>컨택트</span></Link></li>
                <li className={styles.menu}><Link href='/'><FaPaperclip size={23}/><span>팔로우</span></Link></li>
                {/* <li className={styles.menu}><Link href='/festival'><FaRegCalendar size={23}/><span>페스티벌</span></Link></li> */}
                <hr className={styles.menu_line}></hr>
                <li className={styles.menu}><Link href='/share'><FaRegSquarePlus size={23}/><span>글쓰기</span></Link></li>
                <li className={styles.menu}><Link href='/profile'><FaCircleUser size={23}/><span>프로필</span></Link></li>
                <li className={styles.menu}><Link href='/my_activity/all'><FaRotateLeft size={23}/><span>내 활동</span></Link></li>
                <hr className={styles.menu_line}></hr>
                <li className={styles.menu}><Link href="/"><FaGear size={23}/><span>설정</span></Link></li>
                <li className={styles.menu}><Link href="/"><FaHeadset size={23}/><span>고객센터</span></Link></li>
                <li className={styles.menu}><Link href="https://schooler-corp.com"><FaCircleInfo size={23}/><span>스쿨러 정보</span></Link></li>
            </div>
        </div>
      </header>
    )
}

