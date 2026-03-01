
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import { User } from "../models/user.model.js";
import validator from "validator"

async function registerUser(req,res) {
    //1. take data from user--> username,email,fullname...  from user .model.js
    //2. validation -> not  empty
    //3. check user allready exits-->using email
    //4. avatar is required,check for coverimage--> file 
    //5. upload them to cloudinary
    //6. create user object-->create entry in db;
    //7.remove password and refrsh token field from response
    //8.check user created or not
    //9. return respone
    
    //
    const {username,email,fullName,password}=req.body;
    if(!username) {
        throw new apierror(400,"username is required")
    }
    if(!email) {
        throw new apierror(400,"email is required")
    }
    if(!fullName) {
        throw new apierror(400,"fullName is required")
    }
    if(!password) {
        throw new apierror(400,"password is required")
    }
    //
    if(!(validator.isEmail(email))){
        throw new apierror(400,"Invalid email");
    }
    //
    const exiteduser=await User.findOne({
        $or:[{username},{email}]
    })
    if(exiteduser){
        throw new apierror(409,"User is allready registered")
    }
    //
    //4.multer(midddleware)-->add-->req.files
    const avatarlocalpath= req.files?.avatar[0]?.path;
    if(!avatarlocalpath){
        throw new apierror(400,"Avatar file is required")
    }
    //
    const avatar= await cloudinary_upload(avatarlocalpath);
    if(!avatar){
    throw new apierror(400,"Avatar file is required")
   }
   //7.
   const user= await User.create({
    fullName,
    avatar:avatar.url,
    email,
    password,
    username
   })
   //
    const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new apierror(500,"Something went wrong while registring a user")
   }
   //
    return res.status(201).json(
    new apiresponse(200,createdUser,"User registred Successfully")
   )
}
export {registerUser}