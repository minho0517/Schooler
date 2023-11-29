import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import ChatItem from "@/config/schema/ChatItem";
import JoinChatItem from "@/config/schema/JoinChatItem";
import PostItem from "@/config/schema/PostItem";
import User from "@/config/schema/User/User";
import { pushNotification } from "@/utils/notification/pushNotification";
import axios from "axios";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";


export default async function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).json({ error : "요청이 올바르지 않습니다"})
    } 

    try {
        await dbConnect();
        const userId = (await getServerSession(req, res, authOptions)).user.id;
        const profile = await User.findById(userId);
        const { content, fileUrl } = req.body;
        const { roomId } = req.query;

        if(!profile) {
            return res.status(401).json({ error : "권한이 없습니다"})
        }
        if(!roomId) {
            return res.status(400).json({ error : "룸 아이디 필요"})
        }
        if(!content) {
            return res.status(400).json({ error : "내용이 없습니다"})
        }

        const room = await PostItem.findById(roomId);
        if(!room) {
            return res.status(404).json({ error : "해당 오픈 셰어링을 찾을 수 없습니다"})
        }
        const isJoined = await JoinChatItem.exists({ user_id : userId, room_id : roomId });
        if(!isJoined) {
            const newJoin = new JoinChatItem({
                room_id : new ObjectId(roomId),
                user_id : new ObjectId(userId),
            });
            await newJoin.save();
        }

        const message = new ChatItem({
            room_id : roomId,
            user_id : userId,
            content,
            fileUrl,
        });
        await message.save();

        const messageData = {
            ...message._doc,
            userId : profile.id,
        }

        const roomKey = `chat:${roomId}:messages`;

        const notiData = {
            roomId,
            messageData,
        }
        const pushData = {
            pushData : notiData,
            type : "Contact",
            userId,
            roomId,
        }

        await pushNotification(pushData);

        res?.socket?.server?.io?.emit(roomKey, messageData);

        return res.status(200).json(messageData)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg : "메시지 전송 중 오류 발생"})
    }
}