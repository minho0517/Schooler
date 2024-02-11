import dbConnect from "@/config/db";
import User from "@/config/schema/User/User";
import { NextResponse } from "next/server";


export async function GET(req, { params : {id} }) {
    try {

        await dbConnect();
        const userInfo = await User.findById(id).select('school');

        return NextResponse.json(userInfo.school, {status : 200});
    } catch (err) {
        return NextResponse.json({status : 500});
    }
}