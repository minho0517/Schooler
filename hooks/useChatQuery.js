import { useSocket } from "@/components/Provider/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useChatQuery = ({
    apiUrl,
    queryKey,
}) => {
    const { isConnected } = useSocket();

    const fetchData = async ({pageParam = 1}) => {
        const response = await axios.get(apiUrl + `&page=${pageParam} `);
        const data = response.data;
        return data;
    }

    console.log(isConnected)

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useInfiniteQuery(
        queryKey, fetchData, {
        refetchOnWindowFocus : false,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined;
            return allPages.length + 1;
        },
        refetchInterval : isConnected ? false : 1000,
    });

    return {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage, 
        status,
    }
}