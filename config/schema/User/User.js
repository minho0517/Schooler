import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    id : {
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    phone : {
        type : String,
    },
    email : {
        type : String,
        trim : true,
        unique : true,
    },
    school : {
        type : Object,
    },
    role : {
        type : String,
        default : 'User',
        enum : ['Admin', 'User']
    },
    pushSubscribe : {
        type : Object,
    }
}, 
{timestamps : true}
);

export default mongoose.models.User || mongoose.model("User", UserSchema);