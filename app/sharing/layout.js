"use client"

import { usePathname } from 'next/navigation';
import styles from './sharingLayout.module.css';
import Link from 'next/link';
import { TopHeader } from '@/components/Header/Top/TopHeader';

export default function SharingLayout({ children }) {

  const pathname = usePathname()

  return (
    <div className={styles.page}>
      <TopHeader />
      <div className={styles.wrapper}>
        {!pathname.includes('/tag') && <div className={styles.header}>
          <div className={styles.optionGroup}>
            <Link className={`${styles.option} ${pathname.includes('/sharing/all') ? styles.active : ""}`} href="/sharing/all">전체</Link>
            <hr className={styles.optionLine}></hr>
            <Link className={`${styles.option} ${pathname.includes('/sharing/our_school') ? styles.active : ""}`} href="/sharing/our_school">우리학교</Link>
          </div>
          {/* <Link href='/share' className={styles.mainBtn}><BiCommentAdd size={25}/><span>셰어하기</span></Link> */}
        </div>}
        {children}
      </div>
    </div>
  )
}
