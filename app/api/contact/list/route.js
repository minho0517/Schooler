import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import JoinChatItem from "@/config/schema/JoinChatItem";
import mongoose from "mongoose";


export async function GET(req) {

    const userId = (await getServerSession(authOptions)).user.id;
    const query = req.nextUrl.searchParams;
    const type = query.get('type');
    const page = query.get('page');
    const perPage = 10;

    try {

        await dbConnect();
        let pipeline;
        const id = new mongoose.Types.ObjectId(userId);
        if(type === "opensharing") {
            pipeline = [
                { $match : { user_id : id }},
                { $lookup: {
                    from: 'chatitems',
                    localField: 'room_id',
                    foreignField: 'room_id',
                    as: 'messages'
                }},
                { $lookup: {
                    from: 'postitems',
                    localField: 'room_id',
                    foreignField: '_id',
                    as: 'room_info'
                }},
                { $lookup: {
                    from: 'joinchatitems',
                    localField: 'room_id',
                    foreignField: 'room_id',
                    as: 'memberCount'
                }},
                { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
                { $sort: { 'messages.createdAt': -1 } },
                { $group: {
                    _id: '$_id',
                    room: { $first: '$$ROOT' },
                    memberCount: { $sum: 1 },
                    messages: { $push: '$messages'},
                }},
                { $project: {
                    _id: 1,
                    room: 1,
                    latestMessage: { $slice: ['$messages', 1] },
                    memberCount : 1,
                }},
                { $sort: { 'latestMessage.createdAt': -1, 'room.createdAt': -1 }}
            ]
        } else if(type === "personal") {
            pipeline = [
                { $match : {user_id : '2134'}}
            ]
        }
        const roomList = await JoinChatItem.aggregate(pipeline).skip((page - 1) * perPage).limit(perPage);

        return NextResponse.json(roomList, {status : 200});
        
    } catch(err) {
        return NextResponse.json("데이터를 가져오는 중 오류가 발생했습니다", {status : 500})
    }
}