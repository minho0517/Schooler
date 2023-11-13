import mongoose, { Schema } from "mongoose";

const BookmarkSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    bookmark_what : {
        type : Schema.Types.ObjectId,
        required : true,
    },
},
{timestamps : true}
);



export default mongoose.models.BookmarkItem || mongoose.model('BookmarkItem', BookmarkSchema);