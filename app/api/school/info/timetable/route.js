import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import SchoolItem from "@/config/schema/SchoolItem";
import User from "@/config/schema/User/User";
import { identify } from "@/utils/identity";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(req) {
    const userId = (await getServerSession(authOptions)).user.id;
    try {

        await dbConnect();

        const school = await User.findById(userId).select('school');
        const schoolData = await SchoolItem.findById(school.school.schoolCode);

        if(schoolData.type !== "alternative") {
            const date = new identify().today();
            const apiUrl = schoolData.classType === "중학교" && "https://open.neis.go.kr/hub/misTimetable" || schoolData.classType === "고등학교" && "https://open.neis.go.kr/hub/hisTimetable";
            const response = await axios.get(`${apiUrl}?KEY=${process.env.SCHOOL_API_KEY}&Type=json&pIndex=1&pSize=10&SD_SCHUL_CODE=${schoolData.apiCode}&ATPT_OFCDC_SC_CODE=${schoolData.officeCode}&ALL_TI_YMD=${date}&GRADE=1&CLASS_NM=01`);
            const data = await response.data;
            let timeTableData;
            if(schoolData.classType === "중학교") {
                timeTableData = data.misTimetable ? data.misTimetable[1].row : [];
            } else if(schoolData.classType === "고등학교") {
                timeTableData = data.hisTimetable ? data.hisTimetable[1].row : [];
            } else {
                timeTableData = []
            }
        
            return NextResponse.json(timeTableData, {status : 200});
        }


        return NextResponse.json([], {status : 200});

    } catch (err) {
        return NextResponse.json(err, { status : 500 })
    }
}