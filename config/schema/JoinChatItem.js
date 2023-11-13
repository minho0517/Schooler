import mongoose, { Schema } from "mongoose";

const JoinChatSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    }, 
    room_id : {
        type : Schema.Types.ObjectId,
        required : true,
    },
},
    {timestamps : true}
);



export default mongoose.models.JoinChatItem || mongoose.model('JoinChatItem', JoinChatSchema);