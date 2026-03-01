
import {apierror} from "../utils/apierror.js"
import {apiresponse} from "../utils/apiresponse.js"
import { User } from "../models/user.model.js";
import validator from "validator"
import {cloudinary_upload} from "../utils/cloudinary.js"

async function generateAccessRefreshToken(id) {
    const user=await User.findById(id);
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();
    //save refresh token to db
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});
    //
    return {accessToken,refreshToken}
}

//1.register 
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

//2.login
async function loginUser(req,res) {
    //1. get data;
    const {username,email,password}=req.body;
    if(!username && !email){
        throw new apierror(400,"username or email is required");
    }
    if(!password) {
        throw new apierror(400,"password is required");
    }
    //2.check user exist or not
    const user=await User.findOne({
        $or:[{username},{email}]
    });
    if(!user) {
        throw new apierror(400,"user not registered")
    }
    //3.validate password
    const validpassword=await user.isPasswordCorrect(password);
    if(!validpassword) {
        throw new apierror(400,"incorrect password")
    }
    //4.
   const {accessToken,refreshToken}=await generateAccessRefreshToken(user._id);
   //5.
     const loggedInUser=await User.findById(user._id).select(
     "-password -refreshToken"
    )
   //6.cookies
    //by default any one can modify the cookies on frontend;
    const options={
     httpOnly:true,// modifiable only by server not by frontend
     secure:true//-->
    }
    //res
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
     new apiresponse(
         200,
         {
            user:loggedInUser,accessToken,refreshToken 
         },
         "User logged In Successfully"
   )
   )
}

export {loginUser}