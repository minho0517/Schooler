import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await dbConnect();
        const sharingData = await PostItem.aggregate(
            { $match : { deleted : false, scope : "전체" }}
        )
        .match({ deleted: false, scope: "전체" })
        .sort({ _id: -1 })
        .lookup({
            from: 'likeitems',
            localField: '_id',
            foreignField: 'like_what',
            as: 'likeitems',
        })
        .lookup({
            from: 'commentitems',
            localField: '_id',
            foreignField: 'post_id',
            as: 'commentitems',
        })
        .group({ _id: '$topic', posts: { $push: '$$ROOT' } })
        .project({ _id: 0, topic: '$_id', posts: { $slice: ['$posts', 5] } })
        .exec();
        return NextResponse.json(sharingData, {status : 200});
    } catch (err) {
        return NextResponse.json({status : 500})
    }
}