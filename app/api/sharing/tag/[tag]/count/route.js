import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import { NextResponse } from "next/server";


export async function GET(req, {params}) {

    const {tag} = params;
 
    try {
        await dbConnect();
        const tagCount = await PostItem.countDocuments({ hashtag: { $in: [tag] }, deleted : false});
        return NextResponse.json(tagCount, {status : 200});
    } catch (err) {
        throw err
    }

}