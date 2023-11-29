"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./SharingList.module.css";
import { Fragment, useEffect, useRef, useState } from "react";
import useObserver from "@/hooks/useObserver";
import Loader from "@/components/Utils/Loader/Loader";
import ProfileCard from "@/components/Card/Sharing/ProfileCard";
import BlankWrapper from "@/components/Utils/Blank/BlankWrapper";
import axios from "axios";
import { useGetQuery } from "@/hooks/useGetQuery";

export default function SharingList() {

    const [subject, setSubject] = useState(0);

    const menu = [
        {subject : "sharing", msg : "아직 공유한 셰어링이 없습니다", title : "셰어링"},
        {subject : "bookmark", msg : "즐겨찾기가 비어있습니다", title : "즐겨찾기"}
    ]

    const apiUrl = `/api/my/activity/${menu[subject].subject}?`;
    const queryKey = ['get-my-sharingList', menu[subject].subject];

    const { data, fetchNextPage, isFetchingNextPage, status, hasNextPage } = useGetQuery({ apiUrl, queryKey })

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
        underlineRef.current.style.left = distance + (20 * subject) + "px";
    },[subject]);

    const setDeleteHandler = async (id) => {
        const response = await axios.delete(`/api/post/${id}`);
        return response;
    }

    const queryClient = useQueryClient();

    const deleteMutation = useMutation((id) => setDeleteHandler(id), {
        onSuccess : () => {
            queryClient.invalidateQueries(['get-my-sharingList', "sharing"]);
        },
    });

    const deleteHandler = (id) => {
        deleteMutation.mutate(id);
    }

    const setBookmarkHandler = (id) => {
        const response = axios.post(`/api/post/${id}/bookmark`);
        return response;
    }
    const bookmarkMutation = useMutation((id) => setBookmarkHandler(id), {
        onSuccess : () => {
            queryClient.invalidateQueries(['get-my-sharingList', "bookmark"]);
        },
    });
    const bookmarkHandler = (id) => {
        bookmarkMutation.mutate(id);
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.menuWrapper}>
                    {menu.map((item, i) => (
                        <div key={i} ref={el => menuRef.current[i] = el} onClick={() => subjectHandler(i)} className={styles.menu}><span>{menu[i].title}</span></div>
                    ))}
                </div>
                <div ref={underlineRef} className={styles.underline}></div>
            </div>
            <div className={styles.listWrapper}>
                {status === "loading" && <div className={styles.loadingWrapper}><Loader size={45} border={5} /></div>}
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group?.map((e, i) => (
                            <ProfileCard deleteHandler={() => deleteHandler(e.id)} bookmarkHandler={() => bookmarkHandler(e.id)} key={i} data={e} menu={menu[subject].subject} />
                        ))}
                    </Fragment>
                ))}
                {data?.pages[0].length === 0 && <BlankWrapper size={15} message={menu[subject].msg} />}
            </div>
            {isFetchingNextPage && <div className={styles.loadingWrapper}><Loader size={45} border={5} /></div>}
            <div ref={bottom}></div>
        </div>

    )
}