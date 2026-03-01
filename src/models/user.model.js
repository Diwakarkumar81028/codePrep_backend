import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema=new Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        immutable:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,//cloudinary url
        required:true,
    },
   age:{
    type:Number,
    min:6,
    max:80
   },
   role:{
    type:String,
    enum:["user","admin"],
    default:"user"
   },
   problemSolved:{
    type:[String],
   },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String
    }
  } ,
  {
    timestamps:true
  }
)
//mongoose methods;

//password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password)
}

//jwt
//access token
userSchema.methods.generateAccessToken=function(){
  return jwt.sign(
    {//payload
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,//secrect key
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}
//refresh token--> same as access token
userSchema.methods.generateRefreshToken=function(){
       return jwt.sign(
    {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}
//
export const User=mongoose.model("User",userSchema)