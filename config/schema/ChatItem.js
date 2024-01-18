import mongoose, { Schema } from "mongoose";
import LikeItem from "./LikeItem";

const ChatSchema = new Schema({
    room_id : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    user_id : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    content : {
        type : String,
        required : [true, '내용을 입력해주세요'],
    },
    fileUrl : {
        type : String,
    },
    type : {
        type : String,
        enum : ['Opensharing','Personal'],
    }
},
{timestamps : true}
);

ChatSchema.set('toObject', { virtuals: true });
ChatSchema.set('toJSON', { virtuals: true });

ChatSchema.virtual('likes', {
    localField : '_id',
    foreignField : 'like_what',
    ref : LikeItem,
});


export default mongoose.models.ChatItem || mongoose.model('ChatItem', ChatSchema);