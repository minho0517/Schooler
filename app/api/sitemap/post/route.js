import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const posts = await PostItem.find({ scope : "전체", deleted : false }).exec();
        return NextResponse.json(posts, { status : 200 });
    } catch (err) {
        return NextResponse.json(err, {status : 500})
    }
}