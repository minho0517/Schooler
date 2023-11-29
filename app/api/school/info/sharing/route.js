import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import SchoolItem from "@/config/schema/SchoolItem";
import User from "@/config/schema/User/User";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


export async function GET(req) {
    const query = req.nextUrl.searchParams;
    const userId = query.get('user');
    try {

        await dbConnect();

        const school = await User.findById(userId).select('school');
        const schoolData = await SchoolItem.findById(school.school.schoolCode);
        const countStudent = await User.countDocuments({ 'school.schoolCode' : school.school.schoolCode });
        const countSharing = await PostItem.countDocuments({ scope : "우리학교", school : school.school.schoolCode })

        const data = {
            schoolData,
            countStudent,
            countSharing,
        };

        return NextResponse.json(data, {status : 200});

    } catch (err) {
        return NextResponse.json(err, { status : 401 })
    }
}