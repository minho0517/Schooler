"use client"

import styles from "./ChatBox.module.css";
import { Fragment, useEffect, useRef, useState } from "react";
import useObserver from "@/hooks/useObserver";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatQuery } from "@/hooks/useChatQuery";
import BlankWrapper from "@/components/Utils/Blank/BlankWrapper";
import ChatItem from "@/components/Contact/ChatItem/ChatItem";
import Loader from "@/components/Utils/Loader/Loader";
import axios from "axios";

export default function ChatBox({ id }) {
    const [message, setMessage] = useState('');
    const [sendBtn, setSendBtn] = useState(true);
    const onWritingHandler = (event) => {
        setMessage(event.target.value);
        sendBtnHandler();
    } 
    const sendBtnHandler = () => {
        const textString = message.replace(/\s/g, '')
        if(textString) {
            setSendBtn(false)
        } else {
            setSendBtn(true)
        }
    }
    useEffect(() => {
        sendBtnHandler();
    }, [message])

    const apiUrl = `/api/chat/message?roomId=${id}`;
    const queryKey = [`chat:${id}`];
    const addKey = `chat:${id}:messages`;
    const updateKey = `chat:${id}:messages:update`;

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useChatQuery({ apiUrl, queryKey });

    useChatSocket({ queryKey, addKey, updateKey })
    
    const submitHandler = (event) => {
        event.preventDefault();
        const data = {
            content : message,
            fileUrl : null,
        }
        try {
            axios.post(`/api/socket/contact/messages?&roomId=${id}`, data)
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
        const textString = message.replace(/\s/g, '')
        if(event.key === "Enter" && !event.shiftKey && textString) {
            event.preventDefault();
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
                {status === "loading" && <div className={styles.loaderWrapper}><Loader border={4} size={45}/></div>}
                <div className={styles.listWrapper}>
                    {data?.pages[0].length === 0 && <BlankWrapper size={15} height={400} message={"대화 창이 비어있습니다"} />}
                    {data?.pages.map((group, i) => (
                        <Fragment key={i}>
                            {group.map((e, i) => (
                                <ChatItem data={e} key={i}/>
                            ))}
                        </Fragment>
                    ))}
                    {isFetchingNextPage && <div className={styles.loaderListWrapper}><Loader border={3} size={25}/></div> }
                    <div ref={top}></div>
                </div>
            </div>
            <div className={styles.chatInput}>
                <textarea onChange={onWritingHandler} value={message} onKeyPress={enterKeyHandler} placeholder="메시지를 입력해주세요" rows={2} className={styles.input} ></textarea>
                <button disabled={sendBtn} onClick={submitHandler} className={styles.sendBtn}>보내기</button>
            </div>
        </div>
    )
}