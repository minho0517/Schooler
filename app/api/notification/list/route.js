import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import NotificationItem from "@/config/schema/User/NotificationItem";
import mongoose from "mongoose";


export async function GET(req) {

    const userId = (await getServerSession(authOptions)).user.id;
    const query = req.nextUrl.searchParams;
    const page = query.get('page');
    const perPage = 15;

    try {
        await dbConnect();
        const list = await NotificationItem.find({ user_id : userId }).sort({ _id : -1 }).skip((page - 1) * perPage).limit(perPage);
        
        return NextResponse.json(list, {status : 200})

    } catch(err) {
        console.log(err)
        return NextResponse.json("알림 내용을 가져오는데 문제가 발생했습니다", {status:500})
    }
}