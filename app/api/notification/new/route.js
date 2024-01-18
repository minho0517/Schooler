import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import NotificationItem from "@/config/schema/User/NotificationItem";


export async function GET(req) {
    const userId = (await getServerSession(authOptions)).user.id;
    try {
        await dbConnect();
        const exist = await NotificationItem.exists({ user_id : userId, isChecked : false });
        return NextResponse.json({ exist : exist ? true : false }, {status: 200});
    } catch(err) {
        console.log(err)
        return NextResponse.json({ msg: "새로운 알림을 가져오는 중 에러 발생", exist : false }, {status : 500})
    }
}

export async function POST() {
    const userId = (await getServerSession(authOptions)).user.id;
    try {
        await dbConnect();
        const currentTime = new Date();
        const result = await NotificationItem.updateMany(
            { user_id : userId, isChecked: false, createdAt: { $lt: currentTime } },
            { $set: { isChecked: true } }
        );
        return NextResponse.json({status: 200});
    } catch(err) {
        console.log(err)
        return NextResponse.json({status : 500})
    }
}