"use client";

import { Fragment, useRef, useState } from "react";
import styles from "./OpenSharingBox.module.css";
import axios from "axios";
import { useChatQuery } from "@/hooks/useChatQuery";
import { useChatSocket } from "@/hooks/useChatSocket";
import useObserver from "@/hooks/useObserver";
import Loader from "@/components/Utils/Loader/Loader";
import BlankWrapper from "@/components/Utils/Blank/BlankWrapper";
import { useQueryClient } from "@tanstack/react-query";
import ChatItem from "@/components/Contact/ChatItem/ChatItem";

export default function OpenSharingBox({ roomId}) {

    const [message, setMessage] = useState('');
    
    const onWritingHandler = (event) => {
        setMessage(event.target.value);
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
            axios.post(`/api/socket/contact/messages?roomId=${roomId}`, data)
            .then((res) => {
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

    const queryClient = useQueryClient();

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
                    {status === "loading" && <div className={styles.loaderWrapper}><Loader border={3} size={30}/></div> }
                    {data?.pages[0].length === 0 && <BlankWrapper size={15} height={400} message={"셰어링에 실시간으로 공감해보세요!"} />}
                    {data?.pages.map((group, i) => (
                        <Fragment key={i}>
                            {group.map((e, i) => (
                                <ChatItem type={'card'} data={e} key={i}/>
                            ))}
                        </Fragment>
                    ))}
                    {isFetchingNextPage && <div className={styles.loaderWrapper}><Loader border={3} size={25}/></div> }
                    <div ref={top}></div>
                </div>
            </div>
            <div className={styles.input}>
                <form onSubmit={submitHandler} className={styles.inputBox}>
                    <textarea value={message} onKeyPress={enterKeyHandler} onChange={onWritingHandler} placeholder="메시지를 입력해주세요" rows={2} className={styles.chatInput}></textarea>
                </form>
            </div>
        </div>
    )
}
