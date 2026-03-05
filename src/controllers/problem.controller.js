import { submitBatch } from "../utils/submitbatch.js";
import getLanguageId from "../utils/languageid.js";
import { submitToken } from "../utils/sumitToken.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { Problem } from "../models/problem.model.js";

//1. create problem
async function createProblem(req,res) {
 try {
       //1. authenticate admin--> middleware
       //2.create problem
       const {title,description,difficulty,
           tags,visibleTestCases,
           hiddenTestCases,startCode,
           refrenceSolution,problemCreator}=req.body;
   
       //3.check refrence solution is correct or not;
        for(const {language,completeCode} of refrenceSolution){
           //code ,lang_id,input,output
   
           //creating batch-->submission array 
           const languageId=getLanguageId(language);
           const submissions=visibleTestCases.map((obj,index)=>({
               source_code:completeCode,
               language_id:languageId,
               stdin:obj.input,
               expected_output:obj.output
           }))
           //create a batch--> tokens
          const submitResult=await submitBatch(submissions);
          //send tokens--> for result(status_id)
          const resultToken=submitResult.map((obj)=>obj.token);
          //submit that token--> give a object of submissions
          const testResult=await submitToken(resultToken);
          //
          for(const obj of testResult){
           if(obj.status_id!=3){
               return new apiresponse(400,{},"Error occured while creating the problem");
           }
          }
        }
   
        //4.create the problem store it in db;
       const newproblem= await Problem.create({
          ...req.body,
          problemCreator:req.user._id
        })
   
        return res.status(201)
        .json(
           new apiresponse(201,newproblem,"problem created sucessfully")
        )
 } catch (error) {
    throw new apierror(400,"error while creating the problem")
 }
}
export {createProblem};

//2.update problem
async function updateProblem(req,res) {
    //1.verify admin
    //2.
    const {id}=req.params;
    if(!id) {
        throw new apierror(400,"Invalid problem id")
    }
    const Dsaproblem=await Problem.findById(id);
    if(!Dsaproblem){
        throw new apierror(400,"Invalid problem id")
    }
    //3.data from body
try {
        const {title,description,difficulty,
        tags,visibleTestCases,
        hiddenTestCases,startCode,
        refrenceSolution,problemCreator}=req.body;
       //4.check refrence solution is correct or not;
        for(const {language,completeCode} of refrenceSolution){
            //code ,lang_id,input,output
       
            //creating batch-->submission array 
            const languageId=getLanguageId(language);
            const submissions=visibleTestCases.map((obj,index)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:obj.input,
                expected_output:obj.output
            }))
            //create a batch--> tokens
            const submitResult=await submitBatch(submissions);
            //send tokens--> for result(status_id)
            const resultToken=submitResult.map((obj)=>obj.token);
            //submit that token--> give a object of submissions
            const testResult=await submitToken(resultToken);
            //
            for(const obj of testResult){
               if(obj.status_id!=3){
                return new apiresponse(400,{},"Error occured while creating the problem");
             }
            }
        }
        //5.update
      const newproblem= await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
        
      //6.
      return res.status(200).
      json(
        new apiresponse(200,{},"Problem updated successfully")
      )
} catch (error) {
    throw new apierror(500,"something wrong while updating the problem")
}

}
export{updateProblem}

//3.delete problem
async function deleteProblem(req,res) {
    //1.validate admin
    //2.id
    const {id}=req.params;
    if(!id) {
        throw new apierror(400,"Invalid problem id")
    }
    const Dsaproblem=await Problem.findById(id);
    if(!Dsaproblem){
        throw new apierror(400,"Invalid problem id")
    }
    //3.delete
 try {
      const deletedProblem= await Problem.findByIdAndDelete(id);
      if(!deleteProblem){
       throw new apierror(500,"error while deleting the problem")
      }
      //5
      return res.status(200)
      .json(
       new apiresponse(200,deleteProblem,"Problem deleted successfully")
      )
 } catch (error) {
     throw new apierror(500,"something went wrong while deleting the problem")
 }
}
export {deleteProblem}

//4. get problem by id
async function getProblemById(req,res) {
    //1.verify loggedin user
    //2.id
    const {id}=req.params;
    if(!id) {
        throw new apierror(400,"Invalid problem id")
    }
    //fetch
    const Dsaproblem=await Problem.findById(id);
    if(!Dsaproblem){
        throw new apierror(400,"Invalid problem id")
    }
    //res
    return res.status(200)
    .json(
        new apiresponse(200,Dsaproblem,"Problem fetched successfully")
    )

}
export{getProblemById}

//5. get all problem
async function getAllProblem(req,res) {
    //1.verify user
    try{
        const problems=await Problem.find({});
        if(!problems){
            throw new apierror(500,"Problem not fetched")
        }
        return res.status(200)
        .json(
            new apiresponse(200,problems,"All problem fetched successfully")
        )
    }
    catch(err){
     throw new apierror(500,"Problem not fetched")
    }
}

export{getAllProblem}