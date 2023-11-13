'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./myActivity.module.css";
import { Fragment, useRef } from "react";
import useObserver from "@/hooks/useObserver";
import axios from "axios";
import SharingCard from "@/components/MyActivity/Card/SharingCard";
import LikeCard from "@/components/MyActivity/Card/LikeCard";
import CommentCard from "@/components/MyActivity/Card/CommentCard";
import { identify } from "@/utils/identity";
import Loader from "@/components/Utils/Loader/Loader";
import BlankWrapper from "@/components/Utils/Blank/BlankWrapper";
import ArchiveCard from "@/components/MyActivity/Card/ArchiveCard";
import { useGetQuery } from "@/hooks/useGetQuery";

export default function Page({params : {subject}}) {

    const apiUrl = `/api/my/activity/log/${subject}?`;
    const queryKey = ['get-myActivity', subject]

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useGetQuery({ apiUrl, queryKey })

    const bottom = useRef();

    const onIntersect = ([entry]) => entry.isIntersecting && fetchNextPage();

    useObserver({
        target: bottom,
        onIntersect,
    });

    const removeActivityHandler = async (data) => {
        const response = await axios.delete(`/api/my/activity/log/${data.subject}?id=${data.id}`);
        return response.data;
    }
    const queryClient = useQueryClient();
    const removeMutation = useMutation((data) => removeActivityHandler(data), {
        onSuccess : () => {
            queryClient.invalidateQueries(['get-myActivity', subject]);
        },
    });
    const removeBtnHandler = (id, subject) => {
        const data = {
            id,
            subject
        }
        removeMutation.mutate(data);
    }

    const recoverySharingHandler = async (id) => {
        const response = await axios.post(`/api/my/activity/log/archive?id=${id}`);
        return response.data;
    }
    const recoveryMutation = useMutation((id) => recoverySharingHandler(id), {
        onSuccess : () => {
            queryClient.invalidateQueries(['get-myActivity', subject]);
        },
    });
    const recoveryBtnHandler = (id) => {
        recoveryMutation.mutate(id);
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.list}>
                {status === "loading" && <div className={styles.loadingWrapper}><Loader size={45} border={5} /></div>}
                {subject !== "archive" && data?.pages.map((group, i) => (
                    <Fragment key={i}>
                        {group?.map((group, i) => (
                            <div className={styles.cardList} key={i}>
                                <div className={styles.date}><span>{new identify(group.date).date()}</span></div>
                                {group.activities.map((e, i) => (
                                    <Fragment key={i}>
                                        {e.type === "post" && <SharingCard removeHandler={removeBtnHandler} data={e} />}
                                        {e.type === "like" && <LikeCard removeHandler={removeBtnHandler} data={e} />}
                                        {e.type === "comment" && <CommentCard removeHandler={removeBtnHandler} data={e} />}
                                    </Fragment>
                                ))}
                            </div>
                        ))}
                    </Fragment>
                ))}
                {subject === "archive" && <div className={styles.headerInfo}>  </div> }
                {subject === "archive" && data?.pages.map((group, i) => (
                    <Fragment key={i}>
                        {group?.map((e, i) => (
                            <ArchiveCard removeHandler={removeBtnHandler} recoveryHandler={recoveryBtnHandler} key={i} data={e}/>
                        ))}
                    </Fragment>
                ))}
                {data?.pages[0].length === 0 && <BlankWrapper message={"활동 기록이 없습니다"}/>}
            </div>
            <div ref={bottom}></div>
        </div>
    )
}