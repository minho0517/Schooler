
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import BookmarkItem from "@/config/schema/BookmarkItem";
import PostItem from "@/config/schema/PostItem";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {

    const userId = (await getServerSession(authOptions)).user.id;
    const query = req.nextUrl.searchParams;
    const page = query.get('page');
    const perPage = 10;

    try {
        await dbConnect();
        
        const sharingList =  await PostItem.find({ user_id : userId, deleted : true }).sort({ expirationDate : 1}).skip((page - 1) * perPage).limit(perPage)
        .populate('user_id','id school').populate('likes').populate('comments','_id');

        return NextResponse.json(sharingList, {status : 200})

    } catch(err) {
        throw new Error(err)
    }

}

export async function POST(req) {
    const query = req.nextUrl.searchParams;
    const id = query.get('id');
    const userId = (await getServerSession(authOptions)).user.id;
    
    try {

        await dbConnect();
        await PostItem.findOneAndUpdate({ user_id : userId, _id : id}, { $set: { deleted : false, expirationDate: null }}, { new: true });
        return NextResponse.json({status:200})

    } catch (err) {
        throw new Error(err)
    }
}

export async function DELETE(req) {
    const query = req.nextUrl.searchParams;
    const id = query.get('id');
    const userId = (await getServerSession(authOptions)).user.id;
    
    try {

        await dbConnect();
        await PostItem.findOneAndDelete({ user_id : userId, _id : id});
        return NextResponse.json({status:200})

    } catch (err) {
        throw new Error(err)
    }

}