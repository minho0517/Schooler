import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import BookmarkItem from "@/config/schema/BookmarkItem";
import PostItem from "@/config/schema/PostItem";
import { identify } from "@/utils/identity";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(req, {params}) {

    const { tag } = params;
    const query = req.nextUrl.searchParams;
    const page = query.get('page');
    const user = (await getServerSession(authOptions)).user.id;

    try {
        
        await dbConnect();
        const sharingList = await PostItem.find({ hashtag: { $in: [tag] }, deleted : false, scope : "전체" }).sort({_id : -1}).skip((page - 1) * 10).limit(10).populate('user_id','id school').populate('likes').populate('comments','_id');
        const bookmarkList = await BookmarkItem.find({ user_id : user }).exec();
        sharingList.map((e) => {
            e._doc.isBookmark = bookmarkList.some(item => String(item.bookmark_what) === String(e._id)) ? true : false;
            e.user_id.id = new identify(e.user_id.id).name();
        });
        return NextResponse.json(sharingList, {status : 200});

    } catch (err) {
        return NextResponse.json(new Error(err))
    }
}