import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    }, 
    like_what : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    type : {
        type : String,
        enum : ['Sharing', 'Comment'],
    },
    post_id : {
        type : Schema.Types.ObjectId,
    }
},
{timestamps : true}
);



export default mongoose.models.LikeItem || mongoose.model('LikeItem', LikeSchema);