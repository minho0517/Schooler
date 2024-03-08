import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";


export async function GET(req) {

    const query = req.nextUrl.searchParams;
    const page = query.get('page');
    const perPage = 10;

    try {

        await dbConnect();
        const pipeline = [
            { $match : { livechat : true, deleted : false, scope : "전체" }},
            { $lookup: {
                from: 'chatitems',
                localField: '_id',
                foreignField: 'room_id',
                as: 'messages'
            }},
            { $lookup: {
                from: 'joinchatitems',
                localField: '_id',
                foreignField: 'room_id',
                as: 'memberCount'
            }},
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: {
                _id: '$_id',
                room: { $first: "$$ROOT" },
                chatCount: { $sum: 1 },
                memberCount: { $first: '$memberCount' },
                messages: { $push: '$messages' }
            }},
            { $project: {
                room: 1,
                chatCount: 1,
                memberCount: { $size: "$memberCount" },
                latestMessages: { $slice: ["$messages", 5] }
            }},
            { $sort: { 'memberCount': -1, 'chatCount': -1 }}
        ];
        const roomList = await PostItem.aggregate(pipeline).skip((page - 1) * perPage).limit(perPage);
        return NextResponse.json(roomList, {status : 200});
        
    } catch(err) {
        console.log(err)
        return NextResponse.json("데이터를 가져오는 중 오류가 발생했습니다", {status : 500})
    }
}