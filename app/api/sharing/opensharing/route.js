import dbConnect from "@/config/db";
import { NextResponse } from "next/server";


export async function GET(req) {

    try {
        await dbConnect();
        const currentTime = new Date();

        // 5시간 전의 시간을 계산합니다.
        const fiveHoursAgo = new Date(currentTime);
        fiveHoursAgo.setHours(currentTime.getHours() - 5);

        // MongoDB 쿼리를 작성합니다.
        ChatItem.aggregate([
            {
                $match: {
                    createdAt: { $gte: fiveHoursAgo },
                    type : "Opensharing",
                },
            },
            {
                $group: {
                _id: '$room_id',
                count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        return NextResponse.json({status : 200})
    } catch(err) {
        return NextResponse.json(err, {status : 500})
    }
}