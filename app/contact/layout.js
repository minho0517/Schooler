"use client"

import { Fragment, useEffect, useRef, useState } from 'react';
import styles from './contactLayout.module.css';
import { useGetQuery } from '@/hooks/useGetQuery';
import useObserver from '@/hooks/useObserver';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { identify } from '@/utils/identity';
import Loader from '@/components/Utils/Loader/Loader';
import BlankWrapper from '@/components/Utils/Blank/BlankWrapper';
import { FaChevronLeft, FaUser } from 'react-icons/fa6';

export default function contactLayout({ children }) {

    const router = useRouter();
    const pathname = usePathname();

    const [subject, setSubject] = useState(0);

    const menu = [
        {subject : "opensharing", msg : "아직 공유한 셰어링이 없습니다", title : "오픈"},
        {subject : "personal", msg : "즐겨찾기가 비어있습니다", title : "개인"}
    ]

    const apiUrl = `/api/contact/list?type=${menu[subject].subject}`
    const queryKey = ['get-contactList', menu[subject].subject];

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage, status } = useGetQuery({ apiUrl, queryKey });

    const bottom = useRef();

    const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage();

    useObserver({
        target: bottom,
        onIntersect,
    });

    const underlineRef = useRef(null);
    const menuRef = useRef([]);

    const subjectHandler = (value) => {
        setSubject(value);
    }

    useEffect(() => {
        menuRef.current[subject].classList.add(styles.active);
        menuRef.current.forEach((el, i) => {
            if (i !== subject && el && el.classList.contains(styles.active)) {
                el.classList.remove(styles.active);
            }
        });
        const width = menuRef.current[subject].offsetWidth;
        underlineRef.current.style.width = width + "px";
        let distance = 0;
        for(let i = 0; i < subject; i++) {
            distance += menuRef.current[i].offsetWidth;
        }
        underlineRef.current.style.left = distance + "px";
    },[subject]);

    return (
        <div className={`${styles.page} ${pathname === "/contact" ? styles.menuPage : styles.chatPage}`}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.navbar}>
                        <div className={styles.titleHeader}>
                            <button onClick={() => router.push('/sharing/all')} className={styles.goBackBtn}><FaChevronLeft size={20} /></button>
                            <div className={styles.currentUser}><span>didalsgh</span></div>
                        </div>
                        <div className={styles.menuheader}>
                            <div className={styles.menuWrapper}>
                                {menu.map((item, i) => (
                                    <div key={i} ref={el => menuRef.current[i] = el} onClick={() => subjectHandler(i)} className={styles.menu}><span>{menu[i].title}</span></div>
                                ))}
                            </div>
                            <div ref={underlineRef} className={styles.underline}></div>
                        </div>
                    </div>
                    <div className={styles.list}>
                        {status === "loading" && <div className={styles.loadingWrapper}><Loader size={35} border={4} /></div>}
                        {data?.pages.map((page, i) => (
                            <Fragment key={i}>
                                {page?.map((item, i) => (
                                    <Link key={i} href={`/contact/${item.room.room_id}`} className={styles.roomItem}>
                                        <div className={styles.roomItemWrapper}>
                                            <div className={styles.roomTitle}>
                                                <div className={styles.roomName}><span>{new identify(item.room.room_info[0]?.title).text(23)}</span></div>
                                                <div className={styles.count}><FaUser size={10}/> <span>{item.room.memberCount.length}</span></div>
                                            </div>
                                            <div className={styles.roomInfo}>
                                                {item.latestMessage[0] ? <>
                                                <span className={styles.recentMessage}>{item.latestMessage[0].content}</span>
                                                <span className={styles.messagePasttime}> · {new identify(item.latestMessage[0].createdAt).pastTime()} </span></>:
                                                <span className={styles.recentMessage}>메시지를 보내보세요</span>
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </Fragment>
                        ))}
                        {data?.pages[0].length === 0 && <BlankWrapper size={15} message={"컨택트가 존재하지 않습니다"} />}
                        <div ref={bottom}></div>
                    </div>
                </div>
                <div className={styles.messageContainer}>
                    {children}
                </div>
            </div>
        </div>
    )
}
