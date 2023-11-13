
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import mongoose from "mongoose";
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

        const sharingList = await PostItem.find({ user_id : userId,  deleted : false }).sort({_id : -1}).skip((page - 1) * perPage).limit(perPage)
        .populate('user_id','id school').populate('likes').populate('comments','_id');
        
        return NextResponse.json(sharingList, {status : 200})

    } catch(err) {
        throw new Error(err)
    }

}