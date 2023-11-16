import { useSocket } from "@/components/Provider/socket-provider"
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey,
}) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();
    const { data } = useSession();
 
    useEffect(() => {
        if(!socket) {
            return;
        }
 
        socket.on(updateKey, (message) => {
            queryClient.setQueryData(queryKey, (oldData) => {
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return oldData;
                }

                const newData = oldData.pages.map((page) => {
                    return [
                        page.map((items) => {
                            return {
                                ...items,
                                chatItems : items.chatItems.map((item) => {
                                    if(item._id === message._id) {
                                        return message;
                                    }
                                    return item;
                                })
                            }
                        })
                    ];
                });

                return {
                    ...oldData, 
                    pages : newData,
                }
            });
        });

        socket.on(addKey, (message) => {
            queryClient.setQueryData(queryKey, (oldData) => {
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return {
                        pages : [message]
                    }
                }
                
                const newData = [...oldData.pages];
                const dateTimeString = message.createdAt;
                const date = new Date(dateTimeString);
                const formattedDateTime = date.toISOString().slice(0, 16).replace("T", " ");
                const groupExist = newData[0][0]?._id.datetime === formattedDateTime && newData[0][0]?._id.user_id === message.user_id ? true : false;
                if(groupExist) {
                    newData[0] = newData[0].map((item) => {
                        if(item._id.user_id === message.user_id && item._id.datetime === formattedDateTime) {
                            return {
                                ...item,
                                chatItems : [
                                    ...item.chatItems,
                                    message,
                                ]
                            }
                        } else {
                            return item;
                        }
                    });
                } else {
                    newData[0] = [
                        {
                            _id : {
                                datetime : formattedDateTime,
                                user_id : message.user_id,
                                mine : String(data.user.id) === String(message.user_id) ? true : false,
                            },
                            user : [{
                                id : message.userId,
                            }],
                            chatItems : [
                                message,
                            ],
                        },
                        ...newData[0],
                    ]
                }

                return {
                    ...oldData, 
                    pages : newData,
                };
            });
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
        
    }, [queryClient, addKey, updateKey, queryKey, socket]);
}