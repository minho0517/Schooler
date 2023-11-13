import dbConnect from "@/config/db";
import AuthNumberItem from "@/config/schema/Auth/AuthNumberItem";
import { NextResponse } from "next/server";


export async function POST(req) {
    const data = await req.json();
    try {
        await dbConnect();
        if(!data.email || !data.authNumber) return NextResponse.json('입력 값을 모두 채워주세요', {status : 500})
        const authNumberInfo = await AuthNumberItem.findOne({ email : data.email });
        if(String(authNumberInfo.authNumber) === data.authNumber) {
            return NextResponse.json({ auth : true }, {status : 200})
        } else {
            return NextResponse.json({ auth : false, msg : "인증번호가 틀렸습니다" }, {status : 200});
        }
    } catch (err) {
        return NextResponse.json("에러 발생", {status : 500})
    }
}