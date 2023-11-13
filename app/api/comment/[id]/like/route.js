import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import LikeItem from "@/config/schema/LikeItem";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(req, {params}) {
    const {id} = params;
    const user = (await getServerSession(authOptions)).user.id;
    try {

        await dbConnect();
        const isLiked = await LikeItem.exists({ like_what : id, user_id : user });
        if(isLiked) {
            await LikeItem.deleteOne({ like_what : id, user_id : user })
            return NextResponse.json({action : 'dislike'}, {status : 200});
        } else {
            const like = new LikeItem({
                user_id : new ObjectId(user),
                like_what : new ObjectId(id),
            });
            await like.save();
    
            return NextResponse.json({action:'like'} ,{status : 200})
        }

    } catch(err) {
        return NextResponse.json(new Error(err))
    }
}