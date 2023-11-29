import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    type : {
        type : String,
        enum : ['Like', 'Comment', 'Contact', 'Sharing', 'Notice'],
        required : true,
    },
    url : {
        type : String,
    },
    title : {
        type : String,
    },
    body : {
        type : String,
    },
    activity : {
        type : Schema.Types.ObjectId,
    }, 
    isChecked : {
        type : Boolean,
        default : false,
    }
},
    {timestamps : true}
);

NotificationSchema.index({createdAt:1},{expireAfterSeconds: 30 * 24 * 60 * 60 });

NotificationSchema.set('toObject', { virtuals: true });
NotificationSchema.set('toJSON', { virtuals: true });


export default mongoose.models.NotificationItem || mongoose.model('NotificationItem', NotificationSchema);