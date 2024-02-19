import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import BookmarkItem from "@/config/schema/BookmarkItem";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(req, {params}) {

        const {id} = params;
        const user = (await getServerSession(authOptions)).user.id

    try {
        await dbConnect();

        const isBookmark = await BookmarkItem.exists({ bookmark_what : id, user_id : user });
        if(isBookmark) {
            await BookmarkItem.deleteOne({ bookmark_what : id, user_id : user })
            return NextResponse.json({action : 'bookmark'}, {status : 200});
        } else {
            const bookmark = new BookmarkItem({
                user_id : new ObjectId(user),
                bookmark_what : new ObjectId(id),
            });
            await bookmark.save();
            return NextResponse.json({action : 'unBookmark'}, {status : 200});
        }


    } catch (err) {
        return NextResponse.json(err)
    }
}