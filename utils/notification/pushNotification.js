import mongoose from "mongoose";
import webPush from "web-push";
import dbConnect from "@/config/db";
import { NextResponse } from "next/server";
import PostItem from "@/config/schema/PostItem";
import JoinChatItem from "@/config/schema/JoinChatItem";
import User from "@/config/schema/User/User";

export async function pushNotification(data) {

    const { pushData, userId, type } = data;
    const user_id = new mongoose.Types.ObjectId(userId);

    try {
        await dbConnect();
        let userList;
        let notiContent;
        if(type === "Contact") {
            const room_id = new mongoose.Types.ObjectId(pushData.roomId);
            const info = await PostItem.findById(pushData.roomId);
            userList = await JoinChatItem.aggregate([
                { $match : { room_id : room_id, user_id: { $ne: user_id }} },
                { $lookup : {
                    from : "users",
                    localField : "user_id",
                    foreignField : '_id',
                    as : 'info',
                }},
                { $unwind : "$info" },
                { $project : {
                    pushSubscribe : "$info.pushSubscribe"
                }}
            ]);
            notiContent = {
                title : "[오픈셰어링] " + info.title,
                body : pushData.messageData.content,
                url : `/contact/${pushData.roomId}`,
            }
        } else {
            userList = await User.find({ _id : String(pushData.user_id)});
            notiContent = {
                title : pushData.title,
                body : pushData.body,
                url : pushData.url,
            }
        }
       
        const pushPromise = userList.map((user) => {
            const subscription = user.pushSubscribe;
            if(!subscription) {
                return
            } else {
                webPush.sendNotification(subscription, JSON.stringify(notiContent), {
                    vapidDetails: {
                        subject : "mailto:schooler-corp@gmail.com",
                        publicKey : process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
                        privateKey : process.env.WEB_PUSH_PRIVATE_KEY,
                    }
                })
            }
        });
        await Promise.all(pushPromise);

        return NextResponse.json({status : 200})
    } catch(err) {
        console.log(err);
        return NextResponse.json(err, {status : 500})
    }

}