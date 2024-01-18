import dbConnect from "@/config/db";
import User from "@/config/schema/User/User";
import { NextResponse } from "next/server";


export async function GET(req, params) {
    const { id } = params;
    try {
        await dbConnect();
        const userInfo = await User.findById(id).exec();

        return NextResponse.json({status : 200});
    } catch (err) {
        return NextResponse.json({status : 500});
    }
}