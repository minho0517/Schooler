import dbConnect from "@/config/db";
import ChatItem from "@/config/schema/ChatItem";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { identify } from "@/utils/identity";
import mongoose from "mongoose";
 

export async function GET(req) {
    try {

        const userId = (await getServerSession(authOptions)).user.id;
        const query = req.nextUrl.searchParams;
        const page = query.get('page');
        const roomId = query.get('roomId');
        const perPage = 10;

        await dbConnect();

        const room_id = new mongoose.Types.ObjectId(roomId);
        const chatList = await ChatItem.aggregate([
            { $match : { room_id : room_id } },
            { $sort : { _id : -1 } },
        ])
        .group({
            _id: {
                datetime: {
                    $dateToString: {
                        format: '%Y-%m-%d %H:%M',
                        date: '$createdAt',
                    },
                },
                user_id: '$user_id',
            },
            chatItems: { $push: '$$ROOT' },
        })
        .sort({ '_id.datetime': -1 })
        .addFields({
            '_id.mine': {
                $eq: ['$_id.user_id', new mongoose.Types.ObjectId(userId)]
            },
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
        .limit(perPage);
        
        return NextResponse.json(chatList, {status : 200})
    } catch(err) {
        return new NextResponse("에러 발생", {status : 500})
    }
}   