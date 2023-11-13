"use client";

import styles from "./CommentItem.module.css";
import { PiClockBold } from 'react-icons/pi';
import { BiDotsVerticalRounded, BiLike, BiSolidLike } from 'react-icons/bi'
import { FaAngleDown, FaAngleUp, FaRegComment } from "react-icons/fa6";
import { identify } from "@/utils/identity";
import { Fragment, useEffect, useRef, useState } from "react";
import axios, { all } from "axios";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RecommentItem from "./RecommentItem";
import Loader from "@/components/Utils/Loader/Loader";
import useModal from "@/hooks/useModal";
import { createPortal } from "react-dom";
import MenuModal from "@/components/Utils/Modal/MenuModal";

export function CommentItem({commentData, countRecomment, commentDeleteHandler}) {

    // 댓글 입력 창
    const [activeBtn, setActiveBtn] = useState(true);

    const inputBox = useRef();
    const inputGroup = useRef();

    const onWritingHandler = () => {
        const comment = inputBox.current.value.replaceAll(/(\n|\r\n)/g, "");
        inputBox.current.style.height = "auto";
        inputBox.current.style.height = inputBox.current.scrollHeight - 20 + "px";
        if(!comment) {
            setActiveBtn(true);
        } else {
            setActiveBtn(false)
        }
    };
    const openInputHandler = () => {
        inputBox.current.focus()
        inputGroup.current.style.maxHeight = "300px";
    };
    const unfocusInputHandler = () => {
        setActiveBtn(true);
        inputBox.current.value = "";
        inputBox.current.style.height = "auto"
        inputGroup.current.style.maxHeight = "0";
    };


    // 댓글 수 계산 상태값
    const [addComments, setAddComments] = useState(0);
    const [currentComments, setCurrentComments] = useState(0);
    const [recommentNum, setRecommentNum] = useState(countRecomment);
    const [getData, setGetData] = useState([]);

    useEffect(() => {
        setRecommentNum(countRecomment)
    }, [countRecomment]);


    // 댓글 데이터 가져오기
    const fetchData = async ({pageParam = 1}) => {
        const perPage = addComments > 0 ? 0 : 5;
        const response = await axios.get(`/api/comment/${commentData._id}/recomment?page=${pageParam}&per=${perPage}`);
        const data = response.data;
        const newData = data.reverse();
        setGetData(pageParam === 1 ? [...newData] : [ ...newData, ...getData]);
        setCurrentComments(addComments > 0 ? recommentNum + addComments :  currentComments + data.length);
        return data;
    }

    const { fetchNextPage, isFetchingNextPage, fetchStatus, refetch , remove} = useInfiniteQuery(
        ['get-recomments', commentData._id], fetchData, {
        refetchOnMount : true,
        refetchOnWindowFocus : false,
        enabled : false,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined;
            return allPages.length + 1;
        },
    });
    useEffect(() => {
        remove();
    }, [])


    // 더 보기 댓글 계산
    const moreComments = getData ? recommentNum + addComments - currentComments  : recommentNum;

    // 댓글 더보기 기능
    const moreBtnHandler = () => {
        if(moreComments > 0) {
            if(getData.length === recommentNum + addComments) {
                setCurrentComments(moreComments);
            } else {
                fetchNextPage();
            }
        } else {
            setCurrentComments(0);
        }
    }



    // 댓글 추가 기능
    const queryClient = useQueryClient();

    const addCommentHandler = async (data) => {
        const response = await axios.post(`/api/comment/${commentData._id}/recomment`, data);
        return response.data;
    }
    const addMutation = useMutation((data) => addCommentHandler(data), {
        onSuccess : () => {
            queryClient.invalidateQueries(['get-recomments', commentData._id]);
            refetch();
        },
    });
    const addBtnHandler = (event) => {
        const data = {
            post_id : commentData.post_id,
            content: inputBox.current.value,
        }
        setAddComments(addComments + 1);
        addMutation.mutate(data);
        unfocusInputHandler(event)
    }

    
    // 몇 일전 정보
    const [pastTime, setPastTime] = useState(new identify(commentData.createdAt).pastTime());
    useEffect(() => {
        setPastTime(new identify(commentData.createdAt).pastTime())
    }, [commentData])


    // 좋아요 기능
    const [countLike, setCountLike] = useState(commentData.likes.length);
    const [isLike, setIsLike] = useState(commentData.isLiked)
    
    const commentLikeHandler = () => {
        if(isLike) {
            setIsLike(false);
            setCountLike(countLike - 1);
        } else {
            setIsLike(true);
            setCountLike(countLike + 1);
        }

        axios.post(`/api/comment/${commentData._id}/like`)
    }


    // 답글 삭제 기능
    const deleteHandler = async (id) => {
        const response = await axios.delete(`/api/my/activity/log/comments?id=${id}`);
        return response;
    }
    const deleteMutation = useMutation((id) => deleteHandler(id), {
        onSuccess : () => {
            queryClient.invalidateQueries(['get-recomments', commentData._id]);
            refetch();
        },
    });
    const deleteBtnHandler = (id) => {
        setRecommentNum(recommentNum - 1)
        deleteMutation.mutate(id);
    }


    // 더보기 모달
    const { modal, modalHandler, portalElement } = useModal();

    // 답글 삭제 기능
    const commentDeleteBtnHandler = () => {
        modalHandler();
        commentDeleteHandler(commentData._id)
    }

    const modalMenu = commentData.mine ? [
        { title : "삭제", handler : commentDeleteBtnHandler, type : "delete", component : "button"}, 
    ] : [
        { title : "신고", handler : null, component : "button"}, 
    ];



    return (
        <div className={styles.commentItem}>
            <div className={styles.comment}>
                <div className={styles.wrapper}>
                    <div className={styles.head}>
                        <div className={styles.name}>
                            <a href={"/school/"+ commentData.user_id.school.schoolCode}>{commentData.user_id.school.schoolName}</a>&#12685;
                            <span>{commentData.user_id.id}</span>
                        </div>
                    </div>
                    <p className={styles.content}>
                        {String(commentData.content).split("\n").map((line, i) => {
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
                        <div className={styles.infoItem}><button onClick={openInputHandler} className={styles.actionBtn}><FaRegComment size={13}/><span>답글쓰기</span></button></div>
                    </div>
                    <button onClick={modalHandler} className={styles.optionBtn}> <BiDotsVerticalRounded size={23} /> </button>
                </div>
            </div>
            {recommentNum > 0 &&
            <button onClick={moreBtnHandler} className={styles.moreBtn}>
                {moreComments > 0 ? <span>답글 {moreComments}개</span> : <span>답글 닫기</span> }
                {moreComments > 0 ? <FaAngleDown size={15} /> : <FaAngleUp size={15} />}
            </button> }
            {isFetchingNextPage && <div className={styles.loaderWrapper}><Loader size={25} border={3} /></div> }
            <div className={styles.recomment}>
                <div className={styles.recommentWrapper}>
                    {currentComments > 0 && getData?.map((e, i) => (
                        <RecommentItem deleteHandler={deleteBtnHandler} key={i} recommentData={e} />
                    ))} 
                    <div ref={inputGroup} className={styles.commentInput}>
                        <div className={styles.inputWrapper}>
                            <textarea ref={inputBox} onChange={onWritingHandler} type="text" className={styles.commenting} rows={1} placeholder="댓글을 입력해주세요"></textarea>
                            <div className={styles.inputUnderline}></div>
                            <div className={styles.commentBtnGroup}>
                                <button onClick={unfocusInputHandler} className={`${styles.commentingBtn} ${styles.cancelBtn}`}>취소</button>
                                <button onClick={addBtnHandler} className={`${styles.commentingBtn} ${styles.sendBtn}`} disabled={activeBtn}>댓글</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {addMutation.status === "loading" && <div className={styles.loaderWrapper}><Loader size={25} border={3} /></div>}
            {modal && createPortal(<MenuModal menuList={modalMenu} cancel={modalHandler} />, portalElement)}
        </div>
    )
}