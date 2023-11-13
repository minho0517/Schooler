import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import User from "@/config/schema/User";
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

    const user = (await getServerSession(authOptions)).user.id;
    const school = await User.findById(user).select('school');

    let findQuery;
    let sortQuery;

    await dbConnect();
    if(topic === "전체") {
        findQuery = { scope : "우리학교", deleted: false, school : school.school.schoolCode };
        sortQuery = {_id : -1};
    } else if(topic === "베스트") {
        findQuery = { scope : "우리학교", deleted: false, school : school.school.schoolCode };
        sortQuery = {_id : -1};
    } else {
        findQuery = { scope : "우리학교", topic : topic, deleted: false, school : school.school.schoolCode };
        sortQuery = {_id : -1};
    }
    const sharingList = await PostItem.find(findQuery).sort(sortQuery).skip((page - 1) * 10).limit(10).populate('user_id','id school').populate('likes').populate('comments','_id');
    const bookmarkList = await BookmarkItem.find({ user_id : user}).exec();
    sharingList.map((e) => {
        e._doc.isBookmark = bookmarkList.some(item => String(item.bookmark_what) === String(e._id)) ? true : false;
        e.user_id.id = new identify(e.user_id.id).name();
    });
    return NextResponse.json(sharingList, {status:200})
}