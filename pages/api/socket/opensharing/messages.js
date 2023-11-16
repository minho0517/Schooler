import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/config/db";
import ChatItem from "@/config/schema/ChatItem";
import JoinChatItem from "@/config/schema/JoinChatItem";
import PostItem from "@/config/schema/PostItem";
import User from "@/config/schema/User";
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

        const room = await PostItem.exists({ _id : roomId });
        if(!room) {
            return res.status(404).json({ error : "해당 오픈 셰어링을 찾을 수 없습니다"})
        }
        const isJoined = await JoinChatItem.exists({ user_id : userId, room_id : roomId });
        if(!isJoined) {
            return res.status(404).json({ error : "방에 참가하지 않은 유저입니다"})
        }

        const message = new ChatItem({
            room_id : roomId,
            user_id : userId,
            content,
            fileUrl,
        });
        await message.save();

        const messageData = {
            ...message,
            userId : profile.id,
        }

        const roomKey = `chat:${roomId}:messages`;

        res?.socket?.server?.io?.emit(roomKey, messageData);

        return res.status(200).json(messageData)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg : "메시지 전송 중 오류 발생"})
    }
}