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
            const response = await axios.get(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${process.env.SCHOOL_API_KEY}&Type=json&pIndex=1&pSize=1&SD_SCHUL_CODE=${schoolData.apiCode}&ATPT_OFCDC_SC_CODE=${schoolData.officeCode}&MLSV_YMD=${date}`);
            const mealData = await response.data;    
            return NextResponse.json(mealData.mealServiceDietInfo[1].row, {status : 200});
        }


        return NextResponse.json([], {status : 200});

    } catch (err) {
        console.log(err)
        return NextResponse.json(err, { status : 500 })
    }
}