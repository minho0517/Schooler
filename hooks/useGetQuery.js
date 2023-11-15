import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetQuery = ({
    apiUrl,
    queryKey,
}) => {
    const fetchData = async ({pageParam = 1}) => {
        const response = await axios.get(apiUrl + `&page=${pageParam}`, {maxBodyLength : 2000});
        const data = response.data;
        return data;
    }

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useInfiniteQuery(
        queryKey, fetchData, {
        refetchOnWindowFocus : false,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined;
            return allPages.length + 1;
        },
    });

    return {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage, 
        status,
    }
}