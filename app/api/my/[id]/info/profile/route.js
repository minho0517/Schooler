import dbConnect from "@/config/db";
import User from "@/config/schema/User/User";
import { NextResponse } from "next/server";


export async function GET(req, {params}) {

    const { id } = params;

    try {

        await dbConnect();
        const userInfo = await User.findById(id)
        .select('id school name email');
        
        return NextResponse.json(userInfo, {status:200});

    } catch (err) {
        throw err
    }

}