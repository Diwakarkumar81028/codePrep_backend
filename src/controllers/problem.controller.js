import { submitBatch } from "../utils/submitbatch.js";
import getLanguageId from "../utils/languageid.js";
import { submitToken } from "../utils/sumitToken.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { Problem } from "../models/problem.model.js";
import { User } from "../models/user.model.js";

//1. create problem
async function createProblem(req,res) {
//1. verify admin    
 try {
//2. get Problem info-->req.body;    
   const {
     title,
     description,
     difficulty,
     tags,
     visibleTestCases,
     hiddenTestCases,
     startCode,
     referenceSolution
   } = req.body;

//3. verigy refrence solution is true or not    
   for(const {language,completeCode} of referenceSolution){

      const languageId = getLanguageId(language);
      //create submission array for judge0
      const submissions = visibleTestCases.map((obj)=>({
         source_code:completeCode,
         language_id:languageId,
         stdin:obj.input,
         expected_output:obj.output
      }));

       //1.submit batch and got token
       const submitResult = await submitBatch(submissions);
       const resultToken = submitResult.map((obj)=>obj.token);
       //
        await new Promise(res => setTimeout(res,2000));
       //2. submit token and get status id;
       const testResult = await submitToken(resultToken);

    //    console.log(testResult);
        for(const obj of testResult){
           if(obj.status.id != 3){
              throw new apierror(400,"refrence solution is wrong not getting status id 3")
           }
        }
   }

    const newproblem = await Problem.create({
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
        problemCreator:req.user._id 
     });
     

    const createdproblem=await Problem.findById(newproblem._id).select(
        "-hiddenTestCases"
    )
    //
   return res.status(201).json(
      new apiresponse(201,createdproblem,"problem created successfully")
   );

 } catch (error) {
   throw new apierror(400,"error while creating the problem");
 }
}
export {createProblem};


//2.update problem
async function updateProblem(req,res) {
    //1.verify admin
    //2.problem_id by admin --> which have to update
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
        referenceSolution,problemCreator}=req.body;
       //4.check refrence solution is correct or not;
     for(const {language,completeCode} of referenceSolution){

      const languageId = getLanguageId(language);

      const submissions = visibleTestCases.map((obj)=>({
         source_code:completeCode,
         language_id:languageId,
         stdin:obj.input,
         expected_output:obj.output
      }));

       //1.submit batch and got token
       const submitResult = await submitBatch(submissions);
       const resultToken = submitResult.map((obj)=>obj.token);
       //
        await new Promise(res => setTimeout(res,2000));
       //2. submit token and get status id;
       const testResult = await submitToken(resultToken);


        for(const obj of testResult){
           if(obj.status.id != 3){
              throw new apierror(400,"refrence solution is wrong not getting status id 3")
           }
        }
      }
        //5.update
      const newproblem= await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
      const updatedproblem=await Problem.findById(newproblem._id).select(
        "-hiddenTestCases"
      )  
      //6.
      return res.status(200).
      json(
        new apiresponse(200,updatedproblem,"Problem updated successfully")
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


/////////////////////////
///////////////////////////
//4. get problem by id
async function getProblemById(req,res) {
    //1.verify loggedin user
    //2.id
    const {id}=req.params;
    if(!id) {
        throw new apierror(400,"Invalid problem id")
    }
    //fetch
    const Dsaproblem=await Problem.findById(id).select(
        "-problemCreator -hiddenTestCases"
    );
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
    //2.
    try{
        const problems=await Problem.find({}).select(
            "title difficulty tags _id"
        );
        if(problems.length==0){
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

//6.problem solved by user
async function problemSolvedByUser(req,res) {
    //1.authentication;
    //2.
    // const count=req.user.problemSolved.length;
    const userId=req.user._id;
    const user=await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
    })

    return res.status(200)
        .json(
            new apiresponse(200,user.problemSolved,"All problem solved by user fetched successfully")
        )
}
export {problemSolvedByUser}