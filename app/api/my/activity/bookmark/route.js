
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import BookmarkItem from "@/config/schema/BookmarkItem";
import { identify } from "@/utils/identity";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {

    const userId = (await getServerSession(authOptions)).user.id;
    const query = req.nextUrl.searchParams;
    const page = query.get('page');
    const sortby = query.get('sortby');
    const perPage = 10;
    try {
        await dbConnect();
        
        const bookmarkList =  await BookmarkItem.find({ user_id : userId }).sort({_id : -1}).skip((page - 1) * perPage).limit(perPage)
        .populate({
            path : "bookmark_what",
            model : "PostItem",
            match: { deleted: false },
            populate : [
                { path : 'likes'},
                { path : 'user_id', select : "id school"},
                { path : 'comments', select : "_id"}
            ],
        });

        const sharingList = bookmarkList.map((e) => {
            e._doc.bookmark_what.user_id.id = new identify(e.bookmark_what.user_id.id).name();
            return e.bookmark_what;
        });

        return NextResponse.json(bookmarkList, {status : 200})

    } catch(err) {
        console.log(err)
        return NextResponse.json(err, {status: 500})
    }

}