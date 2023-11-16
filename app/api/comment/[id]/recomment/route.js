import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import CommentItem from "@/config/schema/CommentItem";
import User from "@/config/schema/User";
import { identify } from "@/utils/identity";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import LikeItem from "@/config/schema/LikeItem";
import BookmarkItem from "@/config/schema/BookmarkItem";
import PostItem from "@/config/schema/PostItem";
import SchoolItem from "@/config/schema/SchoolItem";
import ChatItem from "@/config/schema/ChatItem";


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
    const user = (await getServerSession(authOptions)).user.id;
    try {

        await dbConnect();
        // await LikeItem.updateMany({ user_id : '652d53d1210bd53ea62876e8' }, { user_id : new ObjectId('6554f3320212f1b709d40efd') });

        const newComment = new CommentItem({
            user_id : new ObjectId(user),
            depth : 1,
            parent_id : new ObjectId(id),
            post_id : new ObjectId(data.post_id),
            content : data.content,
        });
        await newComment.save();

        // await ChatItem.deleteMany({});

        return NextResponse.json({status : 200});

    } catch (err) {
        return NextResponse.json(new Error(err))
    }
}