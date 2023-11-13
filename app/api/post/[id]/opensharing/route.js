import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import JoinChatItem from "@/config/schema/JoinChatItem";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {

    const { id } = params;
    const query = req.nextUrl.searchParams
    const userId = query.get('user');

    try {

        const isJoined = await JoinChatItem.exists({ user_id : userId, room_id : id });
        const countMember = await JoinChatItem.countDocuments({ room_id : id});

        return NextResponse.json({ isJoined : isJoined ? true : false, countMember : countMember }, {status : 200})

    } catch(err) {
        return NextResponse.json(err, {status : 500})
    }

}   
 
export async function POST(req, {params : {id}}) {

    const userId = (await getServerSession(authOptions)).user.id;

    try {

        const isJoined = await JoinChatItem.exists({ room_id : id, user_id : userId });
        if(isJoined) {
            return NextResponse.json({msg : "이미 참가한 방입니다" }, {status : 400})
        }

        const newJoin = new JoinChatItem({
            room_id : new ObjectId(id),
            user_id : new ObjectId(userId),
        });
        await newJoin.save();

        return NextResponse.json({status : 200})

    } catch(err) {
        return NextResponse.json(err, {status : 500})
    }

}   