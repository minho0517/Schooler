import dbConnect from "@/config/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/config/schema/User/User";

export async function POST(req) {
    const subscription = await req.json();
    const userId = (await getServerSession(authOptions)).user.id;
    try {
        await dbConnect();
        const response = await User.findByIdAndUpdate(userId, {$set : { pushSubscribe : subscription }});

        return NextResponse.json({status : 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({status : 500});
    }
}

export async function DELETE(req) {
    const userId = (await getServerSession(authOptions)).user.id;
    try {
        await dbConnect();
        const response = await User.findByIdAndUpdate(userId, {$set : { pushSubscribe : null }});

        return NextResponse.json({status : 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({status : 500});
    }
}