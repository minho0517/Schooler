"use client";

import { useGetQuery } from "@/hooks/useGetQuery";
import SharingBox from "@/components/BoxList/Sharing/SharingBox";

export default function PostRecommand({ currentId, topic, scope }) {

    const apiUrl = scope === "전체" ? `/api/sharing/list/all?topic=${topic}&page=1` : `/api/sharing/list/ourSchool?topic=전체&page=1`;
    const queryKey = ['get-sharingRecommand', topic, scope];
    const { data, fetchNextPage, status, isFetchingNextPage } = useGetQuery({ apiUrl, queryKey });

    return (
        <SharingBox currentId={currentId} topic={topic} data={data} status={status} scope={scope}/>
    )
}