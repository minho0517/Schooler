import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET(req) {
    const userId = (await getServerSession(authOptions)).user.id;
    const query = req.nextUrl.searchParams;
    const page = query.get('page');
    const perPage = 4;

    try {
        await dbConnect();
        const id = new mongoose.Types.ObjectId(userId);
        const activityList = await PostItem.aggregate([
            { $match: { user_id: id, deleted : false } },
            { $addFields : { type : "post" } },
        ])
        .addFields({
            modifiedDate: { $add: ["$createdAt", 9 * 60 * 60 * 1000] }
        })
        .sort({ modifiedDate: -1 })
        .group({
            _id: {
                year: { $year: "$modifiedDate" },
                month: { $month: "$modifiedDate" },
                day: { $dayOfMonth: "$modifiedDate" },
            },
            activities: { $push: "$$ROOT" },
            sortDate: { $first: "$modifiedDate" } 
        })
        .project({
            _id: 0,
            date: {
                $dateToString: {
                format: "%Y-%m-%d",
                date: {
                    $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: "$_id.day",
                    },
                },
                },
            },
            activities: 1,
            sortDate: 1,
        })
        .sort({ sortDate : -1 })
        .skip((page - 1) * perPage) 
        .limit(perPage);

        return NextResponse.json(activityList, {status : 200})

    } catch(err) {
        throw new Error(err)
    }
}


export async function DELETE(req) {
    const query = req.nextUrl.searchParams;
    const id = query.get('id');
    const userId = (await getServerSession(authOptions)).user.id;
    
    try {

        await dbConnect();
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        await PostItem.findOneAndUpdate({ user_id : userId, _id : id}, { $set: { deleted : true, expirationDate: expirationDate }}, { new: true });
        return NextResponse.json({status:200})

    } catch (err) {
        throw new Error(err)
    }

}