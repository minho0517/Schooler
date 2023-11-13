import mongoose, { Schema } from "mongoose";

const SchoolSchema = new Schema({
    name : {
        type : String,
        required : true,
    }, 
    type : {
        type : String,
        default : 'regular',
        enum : ['regular', 'alternative'],
    },
    apiCode : {
        type : String,
    },
    office : {
        type : String,
    },
    data : {
        type : Object,
    },
},
{timestamps : true}
);



export default mongoose.models.SchoolItem || mongoose.model('SchoolItem', SchoolSchema);