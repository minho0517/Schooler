"use client";

import { Fragment, useRef, useState } from "react";
import styles from "./OpenSharingBox.module.css";
import axios from "axios";
import { useChatQuery } from "@/hooks/useChatQuery";
import { identify } from "@/utils/identity";
import { useChatSocket } from "@/hooks/useChatSocket";
import useObserver from "@/hooks/useObserver";
import Loader from "@/components/Utils/Loader/Loader";

export default function OpenSharingBox({isJoined, roomId}) {

    const [message, setMessage] = useState('');
    const [isJoin, setIsJoin] = useState(isJoined);
    const onWritingHandler = (event) => {
        setMessage(event.target.value);
    } 
    const joinOpensharing = () => {
        if(!isJoin) {
            const response = confirm("오픈셰어링에 참가하시겠습니까?");
            if(response) {
                axios.post(`/api/post/${roomId}/opensharing`)
                .then((res) => {
                    if(res.status === 200) {
                        setIsJoin(true);
                    } else {
                        alert('오류가 발생했습니다. 나중에 다시 시도해주세요')
                    }
                });
            }
            else {
                return
            }
        } else {
            return 
        }
    }

    const apiUrl = `/api/chat/message?roomId=${roomId}`;
    const queryKey = [`chat:${roomId}`];
    const addKey = `chat:${roomId}:messages`;
    const updateKey = `chat:${roomId}:messages:update`;
    

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useChatQuery({ apiUrl, queryKey });

    useChatSocket({ queryKey, addKey, updateKey })
    
    const submitHandler = (event) => {
        event.preventDefault();
        const data = {
            content : message,
            fileUrl : null,
        }
        try {
            axios.post(`/api/socket/opensharing/messages?roomId=${roomId}`, data)
            .then((res) => {
                console.log(res)
                if(res.status === 200) {
                    setMessage('');
                    event.target.focus();
                }
            })
        } catch(err) {
            console.log(err)
        }
    }

    const enterKeyHandler = (event) => {
        if(event.key === "Enter") {
            submitHandler(event);
        } 
        return;
    }

    const top = useRef();

    const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage();

    useObserver({
        target: top,
        onIntersect,
    });

    return (
        <div className={styles.box}>
            <div className={styles.list}>
                <div className={styles.listWrapper}>
                    {status === "loading" && <div className={styles.loaderWrapper}><Loader border={4} size={35}/></div> }
                    {/* {data?.pages[0].length === 0 && <BlankWrapper message={"당신의 일상이나 고민을 셰어해보세요!"} />} */}
                    {data?.pages.map((group, i) => (
                        <Fragment key={i}>
                            {group.map((e, i) => (
                                <ChatItem data={e} key={i}/>
                            ))}
                        </Fragment>
                    ))}
                    {isFetchingNextPage && <div className={styles.loaderWrapper}><Loader border={3} size={25}/></div> }
                    <div ref={top}></div>
                </div>
            </div>
            <div className={styles.input}>
                <form onSubmit={submitHandler} className={styles.inputBox}>
                    <textarea disabled={!isJoin} value={message} onKeyPress={enterKeyHandler} onChange={onWritingHandler} placeholder="메시지를 입력해주세요" rows={2} className={styles.chatInput}></textarea>
                </form>
                {!isJoin && <div onClick={joinOpensharing} className={styles.joinBtn}></div> }
            </div>
        </div>
    )
}

export function ChatItem({data}) {

    const newContent = (content) => { 
        const newContent = String(content).split("\n").map((line, i) => {
            return(
                <Fragment key={i}>
                    {new identify(line).url()}
                    <br/>
                </Fragment>
            );
        });
        return newContent
    }   
    return (
        <div className={`${styles.item} ${data._id.mine && styles.mine}`}>
            <div className={styles.wrapper}>
                {!data._id.mine && <div className={styles.head}>
                    <span className={styles.userId}>{new identify(data.user[0].id).name()}</span>
                </div>}
                {data.chatItems.map((e, i) => (
                    <div key={i} className={styles.chatItem}>
                        <div className={styles.content}>
                            <p>{newContent(e.content)}</p>
                        </div>
                        {data.chatItems.length - 1 === i &&
                            <div className={styles.time}>
                                <span>{new identify(data.chatItems[0].createdAt).hourMin()}</span>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}