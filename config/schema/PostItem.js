import mongoose, { Schema } from "mongoose";
import CommentItem from "./CommentItem";
import LikeItem from "./LikeItem";

const PostSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    topic : {
        type : String,
        required : [true, '토픽을 선택해주세요']
    },
    title : {
        type : String,
        required : [true, '제목을 입력해주세요'],
    },
    content : {
        type : String,
        required : [true, '내용을 입력해주세요'],
    },
    views : {
        type : Number,
        default : 0,
    },
    hashtag : [String],
    livechat : {
        type : Boolean,
        required : true,
    },
    deleted : {
        type : Boolean,
        default : false,
    },
    expirationDate: {
        type : Date,
    },
    scope : {
        type : String,
        required : true,
        enum : ["전체" ,"우리학교"]
    },
    school : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : 'SchoolItem',
    },
    images : {
        type : Array,
    }
},
{timestamps : true}
);

PostSchema.index({expirationDate: 1},{expireAfterSeconds: 0});

PostSchema.set('toObject', { virtuals: true });
PostSchema.set('toJSON', { virtuals: true });

PostSchema.virtual('comments', {
    localField : '_id',
    foreignField : 'post_id',
    ref : CommentItem,
});

PostSchema.virtual('likes', {
    localField : '_id',
    foreignField : 'like_what',
    ref : LikeItem,
});


export default mongoose.models.PostItem || mongoose.model('PostItem', PostSchema);