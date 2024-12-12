import mongoose from "mongoose";

const UserScheme = new mongoose.Schema({
    name:{type:String,require:true,trim:false},
    email:{type:String,require:true,trim:false},
    password:{type:String,require:true,trim:false},
    tc:{type:Boolean,require:true}
});

const UserModel = mongoose.model('user', UserScheme);

export default UserModel;
