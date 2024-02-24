import dbConnect from "@/config/db";
import SchoolItem from "@/config/schema/SchoolItem";
import axios from "axios";
import { NextResponse } from "next/server";


export async function GET(req) {
    const query = req.nextUrl.searchParams;
    const schoolCode = query.get('schoolCode');
    try {
        await dbConnect();
        const school = await SchoolItem.findById(schoolCode);
        const response = await axios.get(`https://open.neis.go.kr/hub/schoolInfo?KEY=${process.env.SCHOOL_API_KEY}&Type=json&pIndex=1&pSize=1&SD_SCHUL_CODE=${school.apiCode}`);
        const schoolData = await response.data;

        let schoolInfo
        if(!schoolData.schoolInfo) {
            const schoolData = await SchoolItem.findById(schoolCode).exec();
            schoolInfo = [
                {
                    SCHUL_NM : schoolData.name,
                    ORG_RDNMA : schoolData.address
                }
            ];
        } else {
            schoolInfo = schoolData.schoolInfo[1].row;
        }

        return NextResponse.json(schoolInfo, {status : 200})
    } catch(err) {
        return NextResponse.json({status : 500})
    }

}