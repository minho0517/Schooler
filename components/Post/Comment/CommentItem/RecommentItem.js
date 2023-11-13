"use client";

import styles from "./CommentItem.module.css";
import { PiClockBold } from 'react-icons/pi';
import { BiDotsVerticalRounded, BiLike, BiSolidLike } from 'react-icons/bi'
import { identify } from "@/utils/identity";
import { Fragment, useState } from "react";
import axios from "axios";
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";
import MenuModal from "@/components/Utils/Modal/MenuModal";

export default function RecommentItem({recommentData, deleteHandler}) {

    // 시간 경과 정보
    const [pastTime, setPastTime] = useState(new identify(recommentData.createdAt).pastTime())


    // 답글 좋아요
    const [countLike, setCountLike] = useState(recommentData.likes.length);
    const [isLike, setIsLike] = useState(recommentData.isLiked)

    const commentLikeHandler = () => {

        if(isLike) {
            setIsLike(false);
            setCountLike(countLike - 1);
        } else {
            setIsLike(true);
            setCountLike(countLike + 1);
        }

        axios.post(`/api/comment/${recommentData._id}/like`)
    }

    
    // 더보기 모달 기능
    const { modal, modalHandler, portalElement } = useModal();

    // 답글 삭제 기능
    const deleteBtnHandler = () => {
        modalHandler();
        deleteHandler(recommentData._id)
    }

    const modalMenu = recommentData.mine ? [
        { title : "삭제", handler : deleteBtnHandler, type : "delete", component : "button"}, 
    ] : [
        { title : "신고", handler : null, component : "button"}, 
    ]

    
    return (
        <div className={styles.recommentItem}>
            <div className={styles.comment}>
                <div className={styles.wrapper}>
                    <div className={styles.head}>
                        <div className={styles.name}>
                            <a href={"/school/"+ recommentData.user_id.school.schoolCode}>{recommentData.user_id.school.schoolName}</a>&#12685;
                            <span>{recommentData.user_id.id}</span>
                        </div>
                    </div>
                    <p className={styles.content}>
                        {String(recommentData.content).split("\n").map((line, i) => {
                            return(
                                <Fragment key={i}>
                                    {new identify(line).url()}
                                    <br/>
                                </Fragment>
                            );
                        })}
                    </p>
                    <div className={styles.info}>
                        <div className={styles.infoItem}><PiClockBold size={14}/><span>{pastTime}</span></div>
                        <div className={styles.infoItem}><button onClick={commentLikeHandler} className={`${styles.actionBtn} ${isLike && styles.active}`}>{isLike ? <BiSolidLike size={14}/>:<BiLike size={14}/>}<span>좋아요 {countLike > 0 ? countLike + "개" : ""}</span></button></div>
                    </div>
                    <button onClick={modalHandler} className={styles.optionBtn}> <BiDotsVerticalRounded size={23} /> </button>
                </div>
            </div>
            {modal && createPortal(<MenuModal menuList={modalMenu} cancel={modalHandler} />, portalElement)}
        </div>
    )
}