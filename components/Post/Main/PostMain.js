"use client";

import { PiEyeBold, PiThumbsUpBold, PiClockBold } from 'react-icons/pi';
import { FaBookmark, FaRegBookmark, FaRegComment } from "react-icons/fa6";
import { identify } from "@/utils/identity";
import { Fragment, useRef, useState } from "react";
import styles from "./PostMain.module.css";
import { BiDotsHorizontalRounded, BiDotsVerticalRounded, BiLike, BiSolidLike, BiSolidShareAlt } from 'react-icons/bi'
import axios from 'axios';
import useModal from '@/hooks/useModal';
import MenuModal from '@/components/Utils/Modal/MenuModal';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import useObserver from '@/hooks/useObserver';

export default function PostMain({data, countTotal, isLiked, isBookmark}) {

    const [pastTime, setPastTime] = useState(new identify(data.createdAt).pastTime());

    const newContent = String(data.content).split("\n").map((line, i) => {
        return(
            <Fragment key={i}>
                {new identify(line).url()}
                <br/>
            </Fragment>
        );
    });


    // 좋아요 기능
    const [isLike, setIsLike] = useState(isLiked);
    const [countLike, setCountLike] = useState(data.likes.length);

    const likeHandler = (e) => {
        e.preventDefault()

        if(isLike) {
            setIsLike(false);
            setCountLike(countLike - 1);
        } else {
            setIsLike(true);
            setCountLike(countLike + 1);
        }

        axios.post(`/api/post/${data._id}/like`)
    }


    // 북마크 기능
    const [isBookmarked, setIsBookmarked] = useState(isBookmark);

    const bookmarkBtnHandler = (event) => {
        event.preventDefault();
    
        if(isBookmarked) {
            setIsBookmarked(false);
        } else {
            setIsBookmarked(true);
        }

        axios.post(`/api/post/${data._id}/bookmark`)
    }


    const router = useRouter();

    const { modal, modalHandler, portalElement } = useModal();

    // 셰어링 삭제 기능
    const deleteHandler = () => {
        modalHandler();
        axios.delete(`/api/post/${data._id}`)
        .then((res) => {
            if(res.status === 200) {
                router.replace("/sharing/all");
            } else {
                alert("삭제 중 오류가 발생했습니다. 나중에 다시 실행해주세요")
            }
        })
    }

    // 더보기 모달 기능
    const modalMenu = data.mine ? [
        { title : "수정", component : "link", link : `/edit/${data._id}`}, 
        { title : "삭제", component : "button", handler : deleteHandler, type : "delete"}, 
    ] : [
        { title : "신고", component : "button", handler : null}, 
    ];


    const addView = () => {
        const views = JSON.parse(sessionStorage.getItem('views')) || [];
        if(!views.includes(data._id)) {
            axios.post(`/api/post/${data._id}`)
            .then((res) => {
                if(res.status === 200) {
                    views.push(data._id);
                    sessionStorage.setItem('views', JSON.stringify(views));
                }
            })
        } else {
            return
        }
    }

    const bottom = useRef();

    const onIntersect = ([entry]) => entry.isIntersecting && addView();

    useObserver({
        target: bottom,
        onIntersect,
    });

    return (
        <div className={styles.post_content}>
            <div className={styles.post_content_wrapper}>
                <button onClick={bookmarkBtnHandler} className={`${styles.bookmarkBtn} ${isBookmarked && styles.active}`}>{isBookmarked ? <FaBookmark size={24}/> : <FaRegBookmark size={24}/>}</button>
                <div className={styles.head}>
                    <h4 className={styles.topic}>{data.topic} {data.scope === "우리학교" && <span>&#12685; {data.user_id.school.schoolName}</span>}</h4>
                    <h2 className={styles.title}>{data.title}</h2>
                    <div className={styles.name}>
                        <a href={"/school/" + data.user_id.school.schoolCode}>{data.user_id.school.schoolName}</a>&#12685;
                        <span>{new identify(data.user_id.id).name()}</span>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.infoItem}><PiClockBold size={17}/><span>{pastTime}</span></div>
                        <div className={styles.infoItem}><PiEyeBold size={17}/><span>{data.views}</span></div>
                        <div className={styles.infoItem}><PiThumbsUpBold size={17}/><span>{data.likes.length}</span></div>
                        <div className={styles.infoItem}><FaRegComment size={16}/><span>{countTotal}</span></div>
                    </div>
                </div>
                <div className={styles.content}>
                    <p className={styles.article}>{newContent}</p>
                    <div className={styles.tags}>
                        {data.hashtag?.map((e, i) => (
                            <a href={"/sharing/tag/" + e} className={styles.tag} key={i} >#{e}</a>
                        ))}
                    </div>
                    <div className={styles.btn_group}>
                        <button onClick={likeHandler} className={`${styles.actionBtn} ${isLike ? styles.active : ''}`}>{isLike ? <BiSolidLike size={25}/> : <BiLike size={25}/>}{countLike > 0 ? <span>{countLike}</span> : ''}</button>                        
                        <button className={styles.actionBtn}><BiSolidShareAlt size={25}/></button>
                        <button onClick={modalHandler} className={`${styles.actionBtn} ${styles.moreBtn}`}><BiDotsVerticalRounded size={29}/></button>
                    </div>
                </div>
                <div ref={bottom}></div>
            </div>
            {modal && createPortal(<MenuModal menuList={modalMenu} cancel={modalHandler} />, portalElement)}
        </div>
    )
}