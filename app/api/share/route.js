import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import PostItem from "@/config/schema/PostItem";
import { ObjectId } from "mongodb";
import dbConnect from "@/config/db";
import User from "@/config/schema/User/User";

export async function GET(req) {
    const query = req.nextUrl.searchParams;
    const postId = query.get("post");
    const user = query.get("user"); 
    try {
        await dbConnect();
        const data = await PostItem.findById(postId).exec();
        const userInfo = await User.findById(user);
        if(userInfo.role !== "Admin" &&  String(data.user_id) !== String(user)) {
            return NextResponse.json({msg: "권한이 없습니다"}, {status : 400});
        }
        return NextResponse.json(data, {status : 200});


    } catch (err) {
        return NextResponse.json(err, {status : 500})
    }
}

export async function POST(req) {

    try {
        const data = await req.json();
        const userId = (await getServerSession(authOptions)).user.id;
        const school = await User.findById(userId).select('school');
    
        await dbConnect();
        const newPost = new PostItem({
            user_id : new ObjectId(userId),
            topic : data.topic,
            title : data.title,
            content : data.content,
            hashtag : data.tags,
            livechat : data.livechat,
            scope : data.scope,
            school : new Object(school.school.schoolCode),
        });
        await newPost.save();

        return NextResponse.json({msg: "포스트 성공"}, {status: 200})
    } catch (error) {
        return NextResponse.json({msg: "포스트 중 오류가 발생했습니다"}, {status: 500})
    }
}