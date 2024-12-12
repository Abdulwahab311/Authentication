import jwt from 'jsonwebtoken'

import UserModel from '../models/User.js'

var checkUserAuth = async(req , res, next)=>{
let token;
const {authorization} = req.headers;
if(authorization && authorization.startsWith('Bearer')){
try{
token = authorization.split(' ')[1];
console.log("token", token);
console.log('Authorization', authorization)

const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY);
console.log(userID);
req.user = await  UserModel.findById(userID).select('-password')
console.log(req.user)
next()
}catch(error){
res.send({status:"failed", message:"Unauthorized User"})
}
}
if(!token){
    res.send({status:"failed", mesage:"Unauthorized user No Token"})
}
}


export default checkUserAuth;