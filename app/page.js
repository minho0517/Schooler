"use client"

import styles from './page.module.css'
import Link from 'next/link'
import { HiOutlineChatAlt2, HiOutlineViewGrid, HiOutlineViewGridAdd } from 'react-icons/hi';
import { useRef } from 'react';
import { FaAngleLeft, FaAngleRight, FaPaperclip, FaRotate, FaSchoolFlag } from 'react-icons/fa6';
import LivechatList from '@/components/LivechatList/LivechatList';


export default function Home() {

  const navigationPrevEl = useRef(null);
  const navigationNextEl = useRef(null);
  const btnGroup = {
    next : navigationNextEl,
    prev : navigationPrevEl,
  }

  return (
    <div className={styles.page}>
      <div className={styles.page_wrapper}>
        <section className={styles.container}>
          <div className={styles.section_header}>
            <Link href='/sharing/livechat' className={styles.section_title}>
              <HiOutlineChatAlt2 size={25}/>
              <h3>LIVECHAT 라이브챗</h3>
            </Link>
            <div className={styles.action_group}>
              <div className={styles.actionBtn} id={styles.update}><FaRotate size={20}/></div>
              <div className={styles.actionBtn} ref={navigationPrevEl}><FaAngleLeft size={23}/></div>
              <div className={styles.actionBtn} ref={navigationNextEl}><FaAngleRight size={23}/></div>
            </div>
          </div>
          {/* <LivechatList buttonGroup={btnGroup} /> */}
        </section>
        <section className={styles.container}>
          <div className={styles.section_header}>
            <Link href='/sharing' className={styles.section_title}>
              <HiOutlineViewGridAdd size={25}/>
              <h3>SHARING 셰어링</h3>
            </Link>
            <div className={styles.action_group}>
              <div className={styles.actionBtn} id={styles.update}><FaRotate size={20}/></div>
            </div>
          </div>
        </section>
        <section className={styles.container}>
          <div className={styles.section_header}>
            <Link href='/follow' className={styles.section_title}>
              <FaSchoolFlag size={23}/>
              <h3>SCHOOL 우리 학교 소식</h3>
            </Link>
            <div className={styles.action_group}>
              <div className={styles.actionBtn} id={styles.update}><FaRotate size={20}/></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
