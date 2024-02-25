import dbConnect from "@/config/db";
import ChatItem from "@/config/schema/ChatItem";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { identify } from "@/utils/identity";
import mongoose from "mongoose";
 

export async function GET(req) {
    try {

        const userId = (await getServerSession(authOptions))?.user.id;
        const query = req.nextUrl.searchParams;
        const page = query.get('page');
        const roomId = query.get('roomId');
        const perPage = 20;

        await dbConnect();

        const room_id = new mongoose.Types.ObjectId(roomId);
        const chatData = await ChatItem.aggregate([
            { $match : { room_id : room_id } },
            { $sort : { _id : -1 } },
        ])
        .group({
            _id: {
                user_id: '$user_id',
                datetime: {
                    $dateToString: {
                        format: '%Y-%m-%d %H:%M',
                        date: '$createdAt',
                    },
                },
                
            },
            chatItems: { $push: '$$ROOT' },
        })
        .sort({ 'chatItems.createdAt': -1 })
        .addFields({
            '_id.mine': userId ? {
                $eq: ['$_id.user_id', new mongoose.Types.ObjectId(userId)]
            } : false,
            '_id.id': new identify('$chatItems.user.id').name(),
        })
        .lookup({
            from: 'users', 
            localField: '_id.user_id', 
            foreignField: '_id', 
            as: 'user',
        })
        .project({
            'user.id' : 1,
            'user.school' : 1,
            'chatItems' : 1
        })
        .sort({ 'chatItems.createdAt': -1 })
        .skip((page - 1) * perPage) 
        .limit(perPage)
        .facet({
            result : [
                {
                    $unwind: '$chatItems'
                },
                {
                    $group: {
                        _id: {
                            id : '$chatItems._id',
                            user_id : '$_id.user_id',
                            datetime : '$_id.datetime',
                            mine : '$_id.mine',
                        },
                        user: { $first: '$user' },
                        chatItems: { $push: '$chatItems' }
                    }
                },
                {
                    $sort: { '_id.id': -1 }
                },
            ]
        })

        let chatList = [];

        for(var i=0; i < chatData[0].result.length; i++) {
            const prevData = chatList[chatList.length - 1];
            const currentData = chatData[0].result[i];
            if(prevData && String(prevData._id.user_id) === String(currentData._id.user_id) && prevData._id.datetime === currentData._id.datetime) {
                prevData.chatItems = [
                    ...currentData.chatItems,
                    ...prevData.chatItems,
                ]
            } else {
                chatList = [
                    ...chatList,
                    currentData,
                ]
            }
        }
        
        return NextResponse.json(chatList, {status : 200})
    } catch(err) {
        console.log(err)
        return NextResponse.json("에러 발생", {status : 500})
    }
}   