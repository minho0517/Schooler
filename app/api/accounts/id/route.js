import User from "@/config/schema/User/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/config/db";


export async function POST(req) {

    const newId = (await req.json()).id;
    const userId = (await getServerSession(authOptions)).user.id;

    try {
        await dbConnect();
        const exist = await User.exists({ id : newId });
        if(!exist) {
            const updatedData = await User.findByIdAndUpdate(userId, { id : newId }).exec();

            return NextResponse.json({status : 200})
        } else {
            return NextResponse.json({ msg : "아이디가 이미 존재합니다" }, {status : 400});
        }
        
    } catch(err) {
        return NextResponse.json(err, {status:500})
    }
}