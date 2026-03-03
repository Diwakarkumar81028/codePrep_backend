import { apierror } from "../utils/apierror.js"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import {redisClient} from "../db/redis.js"

async function verifyAdmin(req,res,next) {
    
       try {
        //1.get access token from cookies
        const token= req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ","")
         if(!token){
             throw new apierror(401,"Unauthorized request")
         }
         //2.check if token is blocked allready--> in redis
         const Isblocked=await redisClient.exists(`token:${token}`);
         if(Isblocked){
            throw new apierror(400,"Invalid Token")
         }
         //3. decodn token
         const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
         //4.find user
        const user= await User.findById(decodedToken?._id).select(
             "-password -refreshToken"
         )
         if(!user){
             //TODO--> discuss about frontend
             throw new apierror(401,"Invalid Access Token")
         }
         //verify role
         if(user.role !='admin'){
            throw new apierror(400,"Invalid token");
         }
         req.user=user;
         next();
       } catch (error) {
          throw new apierror(401,error?.message || "Invalid Access Token")
       }
}

export {verifyAdmin}