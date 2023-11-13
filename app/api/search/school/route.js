import dbConnect from "@/config/db";
import SchoolItem from "@/config/schema/SchoolItem";
import axios from "axios";
import { NextResponse } from "next/server";


export async function GET(req) {
    const query = req.nextUrl.searchParams;
    const school = query.get('query');

    try {
        await dbConnect();
        const response = await axios.get(`https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.SCHOOL_API_KEY}&Type=json&pIndex=1&pSize=100&SCHUL_NM=${school}`);
        const schoolData = await response.data;
        let schoolList
        if(!schoolData.schoolInfo) {
            const schoolData = await SchoolItem.find({ name : { $regex: school } }).exec();
            schoolList = schoolData;
        } else {
            schoolList = schoolData.schoolInfo[1].row;
        }

        return NextResponse.json(schoolList, {status : 200})
    } catch (err) {
        console.log(err)
        return NextResponse.json('에러발생', {status : 500})
    }
}