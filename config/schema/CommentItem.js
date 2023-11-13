import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    post_id : {
        type : Schema.Types.ObjectId,
    },
    depth : {
        type : Number,
        default : 0,
    },
    parent_id : {
        type : Schema.Types.ObjectId,
        default : null,
    },
    content : {
        type : String,
        required : [true, '내용을 입력해주세요'],
    }
},
{timestamps : true}
);

CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { virtuals: true });

CommentSchema.virtual('recomments', {
    ref : 'CommentItem',
    localField : '_id',
    foreignField : 'parent_id',
});

CommentSchema.virtual('likes', {
    localField : '_id',
    foreignField : 'like_what',
    ref : 'LikeItem',
});




export default mongoose.models.CommentItem || mongoose.model('CommentItem', CommentSchema);