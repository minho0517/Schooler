import mongoose, { Schema } from "mongoose";

const AuthNumberSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
    authNumber : {
        type : Number,
        required : true,
    }, 
},
    {timestamps : true}
);

AuthNumberSchema.index({createdAt:1},{expireAfterSeconds: 180 })



export default mongoose.models.AuthNumberItem || mongoose.model('AuthNumberItem', AuthNumberSchema);