"use client";

import { useState } from "react";
import styles from "./OpenSharingCard.module.css";
import axios from "axios";
import { useChatQuery } from "@/hooks/useChatQuery";
import { useChatSocket } from "@/hooks/useChatSocket";
import { FaRegComments, FaUser } from "react-icons/fa6";
import Link from "next/link";
import { identify } from "@/utils/identity";
import { useSocket } from "@/components/Provider/socket-provider";

export default function MoblieOpenSharingCard({isJoined, roomId, countMember}) {

    const [isJoin, setIsJoin] = useState(isJoined);
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

    return (
        <div className={styles.card}>
            <div className={styles.mobileWrapper}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <FaRegComments size={22} />
                        <h4>오픈셰어링</h4>
                    </div>
                    <div className={styles.memberNum}>
                        <FaUser size={13} />
                        <span>{countMember}</span>
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.message}>
                        <span>
                            {data?.pages[0].length === 0 && "셰어링에 실시간으로 공감해보세요!"}
                            {data?.pages[0][0] && data?.pages[0][0]?.chatItems?.at(-1)?.content}
                        </span>
                        <span className={styles.userId}>
                            {data?.pages[0][0] && new identify(data?.pages[0][0]?.chatItems[0]?.createdAt).pastTime()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}