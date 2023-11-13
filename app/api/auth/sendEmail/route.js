import dbConnect from "@/config/db";
import AuthNumberItem from "@/config/schema/Auth/AuthNumberItem";
import { sendEmail } from "@/utils/sendAuthMail";
import { NextResponse } from "next/server";


export async function POST(req) {
    const data = await req.json();  
    try {
        await dbConnect();
        await AuthNumberItem.deleteOne({ email : data.email }).exec();
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        const authNumber = new AuthNumberItem({
            email : data.email,
            authNumber : randomNumber,
        });
        const authNumberData = await authNumber.save();
        const mailBody = {
            number : authNumberData.authNumber,
            email : authNumberData.email
        }
        await sendEmail(mailBody)
        .catch((error) => {
            return NextResponse.json('메일 전송에 실패함', { status: 500 });
        }); 

        const returnBody = {
            createdAt : authNumberData.createdAt,
            email : authNumberData.email
        }
        return NextResponse.json(returnBody, {status : 200})
        
    } catch (err) {
        return NextResponse.json("에러 발생", {status : 500})
    }
}