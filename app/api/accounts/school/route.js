import SchoolItem from "@/config/schema/SchoolItem";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/config/schema/User/User";
import { ObjectId } from "mongodb";


export async function POST(req) {

    const data = await req.json();
    const userId = (await getServerSession(authOptions)).user.id;

    try {

        const isExistSchool = await SchoolItem.findOne({ name : data.school.schoolName, office : data.school.schoolOffice }).exec();

        var schoolCode;
        if(!isExistSchool) {
            const newSchoolItem = new SchoolItem({
                name : data.school.schoolName,
                apiCode : data.school.schoolCode ? data.school.schoolCode : '',
                office : data.school.schoolOffice,
                type : data.school.schoolCode ? "regular" : "alternative",
            });
            const insertData = await newSchoolItem.save();
            schoolCode = insertData._id;
        } else {
            schoolCode = isExistSchool._id;
        }

        const updateData = {
            schoolName : data.school.schoolName,
            schoolCode : new ObjectId(schoolCode),
        }

        const schoolInfo = await User.findByIdAndUpdate(userId, { school : updateData }, { new : true }).exec();

        return NextResponse.json(schoolInfo, {status:200})
    } catch(err) {
        console.log(err)
        return NextResponse.json({status:500})
    }
}