import mongoose, { Schema } from "mongoose";

const submissionScehma=new mongoose.Schema(
    {
       userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
       },
       problemId:{
        type:Schema.Types.ObjectId,
        ref:"Problem",
        required:true,
       },
       code:{
         type:String,
         required:true,
       },
       language:{
        type:String,
        required:true,
        enum:["javascript","cpp","java"]
       },
       status:{
        type:String,
        enum:["pending","accepted","wrong","error"],
        default:"pending"
       },
       runtime:{
        type:Number,//mili second
        default:0,
       },
       memory:{
        type:Number,//mb
        default:0
       },
       errorMessage:{
        type:String,
        default:""
       },
      testCasesPassed:{
        type:Number,
        default:0
      },
      testCasesTotal:{
        type:Number,
        default:0
      }
    },
    {timestamps:true}
)

export const Submission=mongoose.model("Submission",submissionScehma);