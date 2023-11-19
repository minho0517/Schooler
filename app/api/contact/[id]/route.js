import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import { NextResponse } from "next/server";


export async function GET(req, { params : {id} }) {
    
    try {

        await dbConnect();
        const postData = await PostItem.findById(id);

        const infoData = {
            type : postData ? "opensharing" : "personal",
            opensharing : postData,
            personal : null,
        }

        return NextResponse.json(infoData, {status : 200})

    } catch(err) {
        return NextResponse.json("채팅방 정보를 불러오던 중 문제가 발생했습니다", {status: 500})
    }
} 