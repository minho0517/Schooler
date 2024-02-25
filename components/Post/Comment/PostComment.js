"use client";

import { Fragment, useRef, useState } from "react";
import styles from "./PostComment.module.css";
import { FaCircleExclamation } from "react-icons/fa6";
import axios from "axios";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentItem } from "./CommentItem/CommentItem";
import Loader from "@/components/Utils/Loader/Loader";
import BlankWrapper from "@/components/Utils/Blank/BlankWrapper";
import { useSession } from "next-auth/react";
import { moveLogin } from "@/utils/moveLogin";

export default function PostComment({postId, countTotal, countRecomments}) {

    const { data : session } = useSession();

    // 댓글 입력 창
    const [activeBtn, setActiveBtn] = useState(true);

    const inputBox = useRef();
    const btnGroup = useRef();

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
    const focusInputHandler = () => {
        if(!session) {
            inputBox.current.blur();
            return moveLogin();
        };
        btnGroup.current.style.maxHeight = "100px";
    };
    const unfocusInputHandler = () => {
        setActiveBtn(true);
        inputBox.current.value = "";
        inputBox.current.style.height = "auto"
        btnGroup.current.style.maxHeight = "0";
    };


    // 댓글 데이터 가져오기
    const fetchData = async ({pageParam = 1}) => {
        const response = await axios.get(`/api/post/${postId}/comment?page=${pageParam}`);
        const data = response.data;
        return data;
    }
    const queryClient = useQueryClient();
    const { data, refetch, fetchNextPage, isFetchingNextPage, status, fetchStatus } = useInfiniteQuery(
        ['get-comments', postId], fetchData, {
        refetchOnWindowFocus : false,
        refetchOnMount : true,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined;
            return allPages.length + 1;
        },
    });


    // 댓글 수 상태 값
    const [commentNum, setCommentNum] = useState(countTotal);
    const [recommentNum, setRecommentNum] = useState(countRecomments)


    // 댓글 추가 기능
    const addCommentHandler = async (data) => {
        const response = await axios.post(`/api/post/${postId}/comment`, data);
        return response.data;
    }
    const addMutation = useMutation((data) => addCommentHandler(data), {
        onSuccess : () => {
            queryClient.invalidateQueries(['get-comments', postId]);
        },
        onSettled : () => {
            setCommentNum(commentNum + 1);
        }
    });
    const addBtnHandler = (event) => {
        const commentInput = event.target.parentNode.parentNode.children[0];
        const data = {
            content: commentInput.value,
        }
        addMutation.mutate(data);
        unfocusInputHandler(event)
    }


    // 더보기 댓글 계산
    const moreComments = commentNum - ((data?.pages.length - 1) * 5 + data?.pages[data?.pages.length - 1].length) - recommentNum;


    // 답글 삭제 기능
    const deleteHandler = async (id) => {
        const response = await axios.delete(`/api/my/activity/log/comments?id=${id}`);
        return response;
    }
    const deleteMutation = useMutation((id) => deleteHandler(id), {
        onSuccess : () => {
            queryClient.invalidateQueries(['get-comments', postId]);
            refetch();
        },
        onSettled : () => {
            setCommentNum(commentNum - 1)
        }
    });
    const deleteBtnHandler = (id) => {
        deleteMutation.mutate(id);
    }

    return (
        <div className={styles.card}>
            <div className={styles.wrapper}>
                <div className={styles.head}>
                    <h3 className={styles.title}>댓글 {countTotal}</h3>
                    <div className={styles.filter}></div>
                </div>
                <div className={styles.commentInput}>
                    <div className={styles.inputWrapper}>
                        <textarea ref={inputBox} onFocus={focusInputHandler} onChange={onWritingHandler} type="text" className={styles.commenting} rows={1} placeholder="댓글을 입력해주세요"></textarea>
                        <div className={styles.inputUnderline}></div>
                        <div ref={btnGroup} className={styles.commentBtnGroup}>
                            <button onClick={unfocusInputHandler} className={`${styles.commentingBtn} ${styles.cancelBtn}`}>취소</button>
                            <button onClick={addBtnHandler} className={`${styles.commentingBtn} ${styles.sendBtn}`} disabled={activeBtn}>댓글</button>
                        </div>
                    </div>
                </div>
                <div className={styles.commentList}>
                    {addMutation.status === "loading" && <Loader size={25} border={3} />}
                    {status === "loading" && <Loader size={30} border={3} /> }
                    {data?.pages.map((group, i) => (
                        <Fragment key={i}>
                            {group?.map((e, i) => (
                                <CommentItem key={i} commentDeleteHandler={deleteBtnHandler} commentData={e} countRecomment={e.recomments.length} />
                            ))}
                        </Fragment>
                    ))}                    
                    {data?.pages[0].length === 0 && <BlankWrapper size={15} message={"댓글로 게시물에 공감/답변해보세요!"}/>}
                    {isFetchingNextPage && <Loader size={25} border={3} />}
                    {fetchStatus === "idle" && moreComments > 0 &&
                    <button onClick={fetchNextPage} className={styles.moreBtn}>댓글 {moreComments}개 더보기</button>}
                </div>
                <a href="/more/manner" className={styles.moreInfo}>
                    <FaCircleExclamation size={13} />
                    <span>스쿨러 매너 보러가기</span>
                </a>
            </div>
        </div>
    )
}