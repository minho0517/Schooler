import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import CommentItem from "@/config/schema/CommentItem";
import PostItem from "@/config/schema/PostItem";
import User from "@/config/schema/User/User";
import { identify } from "@/utils/identity";
import { addNotification } from "@/utils/notification/addNotification";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(req, {params}) {
    const { id } = params;
    const query = req.nextUrl.searchParams;
    const page = query.get('page');
    const user = (await getServerSession(authOptions)).user.id;
    try {

        await dbConnect();
        const userInfo = await User.findById(user).exec();
        const commentList = await CommentItem.find({ post_id : id, depth : 0 }).sort({ _id : -1 }).skip((page - 1) * 5).limit(5)
        .populate('user_id', 'id school').populate('likes').populate('recomments','parent_id');
        commentList.map((comment) => {
            if(String(comment.user_id._id) === user || userInfo.role === "Admin") comment._doc.mine = true;
            comment.user_id.id = new identify(comment.user_id.id).name();
            comment._doc.isLiked = comment.likes.some((like) => String(like.user_id) === user)
        });

        return NextResponse.json(commentList, {status : 200});


    } catch (err) {
        return NextResponse.json(new Error(err))
    }
}

export async function POST(req, {params}) {
    const { id } = params;
    const data = await req.json()
    const userId = (await getServerSession(authOptions)).user.id;
    const owner = await PostItem.findById(id).exec();
    try {

        await dbConnect();
        const newComment = new CommentItem({
            user_id : new ObjectId(userId),
            post_id : new ObjectId(id),
            content : data.content,
        });
        await newComment.save();
        const notiData = [{
            user_id : new ObjectId(owner.user_id),
            type : "Comment",
            url : `/post/${id}`,
            body : newComment.content,
            title : "회원님의 셰어링에 댓글을 남겼습니다",
            activity : new ObjectId(newComment._id),
        }]
        await addNotification(notiData, userId)

        return NextResponse.json({status : 200});

    } catch (err) {
        return NextResponse.json(new Error(err))
    }
}