import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import CommentItem from "@/config/schema/CommentItem";
import LikeItem from "@/config/schema/LikeItem";
import { addNotification } from "@/utils/notification/addNotification";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(req, {params}) {
    const {id} = params;
    const userId = (await getServerSession(authOptions)).user.id;
    try {

        await dbConnect();
        const isLiked = await LikeItem.exists({ like_what : id, user_id : userId });
        const owner = await CommentItem.findById(id).exec();
        if(isLiked) {
            const like = await LikeItem.findOne({ like_what : id, user_id : userId });
            await LikeItem.deleteOne({ like_what : id, user_id : userId });
            await NotificationItem.deleteMany({ activity : like._id });
            return NextResponse.json({action : 'dislike'}, {status : 200});
        } else {
            const like = new LikeItem({
                user_id : new ObjectId(userId),
                like_what : new ObjectId(id),
                type : "Comment",
                post_id : new ObjectId(owner.post_id),
            });
            await like.save();

            const notiData = [{
                user_id : new ObjectId(owner.user_id),
                type : "Like",
                url : `/post/${owner.post_id}`,
                body : "",
                title : "회원님의 댓글에 좋아요로 공감했습니다",
                activity : new ObjectId(like._id),
            }]
            await addNotification(notiData, userId);
    
            return NextResponse.json({action:'like'} ,{status : 200})
        }

    } catch(err) {
        console.log(err)
        return NextResponse.json(new Error(err))
    }
}