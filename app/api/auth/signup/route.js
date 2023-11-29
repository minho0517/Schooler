import dbConnect from "@/config/db";
import SchoolItem from "@/config/schema/SchoolItem";
import User from "@/config/schema/User/User";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { signIn } from "next-auth/react";

export async function POST(req) {
    const data = await req.json();
    try {
        await dbConnect();
        if(!data.id || !data.password || !data.email || !data.name || !data.school) return NextResponse.json({msg : "빈칸이 존재합니다"}, {status : 400});

        const isExistSchool = await SchoolItem.findOne({ name : data.school.schoolName, office : data.school.schoolOffice });

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
        
        const newUser = new User({
            id : data.id,
            password : await bcrypt.hash(data.password, 12),
            email : data.email,
            name : data.name,
            school : {
                schoolName : data.school.schoolName,
                schoolCode : new ObjectId(schoolCode),
            },
            role : 'User',
        });
        const userData = await newUser.save();

        return NextResponse.json(userData, {status : 200});

    } catch (err) {
        console.log(err)
        return NextResponse.json("에러발생. 나중에 다시 시도해주세요", {status : 500})
    }
}