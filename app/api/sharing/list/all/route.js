import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import User from "@/config/schema/User/User";
import { identify } from "@/utils/identity";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import BookmarkItem from "@/config/schema/BookmarkItem";


export async function GET(req) {
    const query = req.nextUrl.searchParams;
    const topic = query.get('topic');
    const page = query.get('page');
    const start = query.get('start');

    const userId = (await getServerSession(authOptions))?.user.id;

    let findQuery;
    let sortQuery;

    await dbConnect();
    if(topic === "전체") {
        findQuery = { scope : "전체", deleted: false };
        sortQuery = {_id : -1};
    } else if(topic === "베스트") {
        findQuery = { scope : "전체", deleted: false };
        sortQuery = {_id : -1};
    } else {
        findQuery = { scope : "전체", topic : topic, deleted: false };
        sortQuery = {_id : -1};
    }

    let sharingList = await PostItem.find(findQuery).sort(sortQuery).skip((page - 1) * 10).limit(10).populate('user_id','id school').populate('likes').populate('comments','_id');
    if(!userId) {
        sharingList.map((e) => {
            e.user_id.id = new identify(e.user_id.id).name();
        });
    } else {
        const bookmarkList = await BookmarkItem.find({ user_id : userId}).exec();
        sharingList.map((e) => {
            e._doc.isBookmark = bookmarkList.some(item => String(item.bookmark_what) === String(e._id)) ? true : false;
            e.user_id.id = new identify(e.user_id.id).name();
        });
    }

    return NextResponse.json(sharingList, {status:200})
}