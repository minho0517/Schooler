import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import CommentItem from "@/config/schema/CommentItem";
import { identify } from "@/utils/identity";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import LikeItem from "@/config/schema/LikeItem";
import BookmarkItem from "@/config/schema/BookmarkItem";
import PostItem from "@/config/schema/PostItem";
import SchoolItem from "@/config/schema/SchoolItem";
import ChatItem from "@/config/schema/ChatItem";
import JoinChatItem from "@/config/schema/JoinChatItem";
import { addNotification } from "@/utils/notification/addNotification";


export async function GET(req, {params}) {
    const { id } = params;
    const query = req.nextUrl.searchParams;
    const page = query.get('page');
    const perPage = query.get('per');
    const user = (await getServerSession(authOptions)).user.id;
    try {

        await dbConnect();
        const commentList = await CommentItem.find({ parent_id : id }).sort({ _id : -1 }).skip((page - 1) * perPage).limit(perPage)
        .populate('user_id', 'id school').populate('likes')
        commentList.map((comment) => {
            if(String(comment.user_id._id) === user) comment._doc.mine = true;
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
    try {

        await dbConnect();
        // await LikeItem.updateMany({ user_id : '652d53d1210bd53ea62876e8' }, { user_id : new ObjectId('6554f3320212f1b709d40efd') });

        const newComment = new CommentItem({
            user_id : new ObjectId(userId),
            depth : 1,
            parent_id : new ObjectId(id),
            post_id : new ObjectId(data.post_id),
            content : data.content,
        });
        await newComment.save();

        const parentComment = await CommentItem.findById(id).exec();
        const post = await PostItem.findById(parentComment.post_id).exec();
        let notiData;
        if(post.user_id === parentComment.user_id) {
            notiData = [{
                user_id : new ObjectId(parentComment.user_id),
                type : "Comment",
                url : `/post/${parentComment.post_id}`,
                body : newComment.content,
                title : "회원님의 댓글에 답글을 남겼습니다",
                activity : new ObjectId(newComment._id),
            }];
        } else if(parentComment.user_id === newComment.user_id) {
            notiData = [{
                user_id : new ObjectId(post.user_id),
                type : "Comment",
                url : `/post/${post._id}`,
                body : newComment.content,
                title : "회원님의 셰어링에 댓글을 남겼습니다",
                activity : new ObjectId(newComment._id),
            }];
        } else if(parentComment.user_id === newComment.user_id === post.user_id) {
            notiData = []
        } else if(parentComment.user_id !== newComment.user_id !== post.user_id) {
            notiData = [{
                user_id : new ObjectId(parentComment.user_id),
                type : "Comment",
                url : `/post/${parentComment.post_id}`,
                body : newComment.content,
                title : "회원님의 댓글에 답글을 남겼습니다",
                activity : new ObjectId(newComment._id),
            }, {
                user_id : new ObjectId(post.user_id),
                type : "Comment",
                url : `/post/${post._id}`,
                body : newComment.content,
                title : "회원님의 셰어링에 댓글을 남겼습니다",
                activity : new ObjectId(newComment._id),
            }]
        }
        await addNotification(notiData, userId);

        // await ChatItem.deleteMany({});
        // await JoinChatItem.deleteMany({});
        // await LikeItem.deleteMany({})
        // await CommentItem.deleteMany({})
        // await BookmarkItem.deleteMany({})


        return NextResponse.json({status : 200});

    } catch (err) {
        console.log(err)
        return NextResponse.json(new Error(err))
    }
}