import dbConnect from "@/config/db";
import BookmarkItem from "@/config/schema/BookmarkItem";
import CommentItem from "@/config/schema/CommentItem";
import LikeItem from "@/config/schema/LikeItem";
import PostItem from "@/config/schema/PostItem";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/config/schema/User";
import JoinChatItem from "@/config/schema/JoinChatItem";
import ChatItem from "@/config/schema/ChatItem";

export async function GET(req, {params}) {

    const {id} = params;
    const query = req.nextUrl.searchParams;
    const userId = query.get('user');
    
    try {
        await dbConnect();
        const school = await User.findById(userId).select('school').exec();
        const post = await PostItem.findById(id).populate('user_id', 'id school').populate('likes','_id').exec();
        if(!post) return NextResponse.json({status : 404});
        if(post.scope === "우리학교" && String(post.school) !== String(school.school.schoolCode)) return NextResponse.json(new Error('권한이 없습니다'), {status : 404});
        const totalComments = await CommentItem.countDocuments({ post_id : id });
        const totalRecomments = await CommentItem.countDocuments({ post_id : id, depth : 1});
        const isLiked = await LikeItem.exists({ like_what : id, user_id : userId });
        const isBookmark = await BookmarkItem.exists({ bookmark_what : id, user_id : userId});
        const isJoined = await JoinChatItem.exists({ user_id : userId, room_id : id });
        const countMember = await JoinChatItem.countDocuments({ room_id : id});
        if(String(post.user_id._id) === userId) post._doc.mine = true;

        return NextResponse.json({
            data : post, 
            totalComments : totalComments,
            totalRecomments : totalRecomments,
            isLiked : isLiked ? true : false,
            isBookmark : isBookmark ? true : false,
            isJoined : isJoined ? true : false,
            countMember,
        }, {status : 200});
    } catch (err) {
        return NextResponse.json(err, {status : 404})
    }
}

export async function POST(req, {params}) {
    const {id} = params;
    const user = (await getServerSession(authOptions)).user.id;
    try {

        if(!user) return NextResponse.json({status : 400});

        await PostItem.findOneAndUpdate({ _id : id } , { $inc : { views: 1 } })

        return NextResponse.json({status:200})
    } catch(err) {
        throw new Error(err);
    }
}

export async function PUT(req, {params}) {
    const {id} = params;
    const newData = await req.json();
    try {
        await dbConnect();
        await PostItem.findByIdAndUpdate(id, { $set: 
            {   
                topic:  newData.topic,
                title: newData.title,
                content : newData.content,
                hashtag : newData.tags,
                livechat : newData.livechat,
                scope : newData.scope,

            }}, { new: true });

        return NextResponse.json({status:200});
    } catch (err) {
        throw err
    }
}

export async function DELETE(req, {params}) {
    const {id} = params;
    try {
        await dbConnect();
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        await PostItem.findByIdAndUpdate(id, { $set: { deleted : true, expirationDate: expirationDate }}, { new: true });
        await CommentItem.deleteMany({ post_id : id });
        await LikeItem.deleteMany({ like_what : id });
        await BookmarkItem.deleteMany({ bookmark_what : id });
        await JoinChatItem.deleteMany({ room_id : id });
        await ChatItem.deleteMany({ room_id : id });

        return NextResponse.json({status:200})
    } catch (err) {
        return NextResponse.json(err)
    }
}