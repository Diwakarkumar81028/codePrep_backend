import { apierror } from "../utils/apierror.js";
import {Problem} from "../models/problem.model.js"
import { Submission } from "../models/submission.model.js";
import getLanguageId from "../utils/languageid.js";
import { submitBatch } from "../utils/submitbatch.js";
import { submitToken } from "../utils/sumitToken.js";
import { apiresponse } from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";

//1.submit solution
async function submitProblem(req,res) {
    //1.verify user-->verifyjwt
    //2.
    try{
        const userId=req.user._id;
        const problemId=req.params.id;
        //a.   
        const {code,language}=req.body;
        if(!userId || !problemId || !code ||!language){
            throw new apierror(400,"some fields are missing")
        }
        //
        //b.fetch problem from db
        const problem=await Problem.findById(problemId);
         //
       const submittedResult=await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:"pending",
            testCasesTotal:problem.hiddenTestCases.length
         })
         //imp 
         //2.submit code on judge 0;  
        const languageId = getLanguageId(language);
       
         
        const submissions = problem.hiddenTestCases.map((obj)=>({
            source_code:code,
            language_id:languageId,
            stdin:obj.input,
            expected_output:obj.output
        }));
         
        //.submit batch and got token
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((obj)=>obj.token);
        //
        await new Promise(res => setTimeout(res,2000));
        //. submit token and get status id;
        const testResult = await submitToken(resultToken);
        // console.log(testResult);

        //3.submitted result ko update
        let right=0,wrong=0;
        let memory=0,runtime=0;
        let errormessage=null;
        let status="";
        for(const obj of testResult){
            //accepted
            if(obj.status.id==3) {
                right++;
                runtime+=parseFloat(obj.time)*1000;
                memory=Math.max(memory,obj.memory);
            }
            else{//wrong
               wrong++;
               errormessage=obj.stderr;
               status=obj.status.description;
            } 
        }
       if(status=='') status="Accepted";
        //4.store result in db
         submittedResult.status=status;
         submittedResult.testCasesPassed=right;
         submittedResult.runtime=runtime;
         submittedResult.memory=memory;
         submittedResult.errorMessage=errormessage;  

         
         await submittedResult.save({validateBeforeSave:false});
        //  console.log(submittedResult);
        //insert into userschema if problem solved successfully
        if(status=="Accepted"){
            const user=await User.findById(userId);
            if(!user.problemSolved.includes(problemId)){
                user.problemSolved.push(problemId);
                await user.save({validateBeforeSave:false});
            }
        }
         //
            return res.status(201).json(
                new apiresponse(201,submittedResult,"solution submitted")
            );
    }
    catch(err){
        throw new apierror(500,"error while submitting the problem");
    }

}
export {submitProblem}

//2.run code
async function runCode(req,res) {
    //1.verify user-->verifyjwt
    //2.
    try{
        const userId=req.user._id;
        const problemId=req.params.id;
        //a.   
        const {code,language}=req.body;
        if(!userId || !problemId || !code ||!language){
            throw new apierror(400,"some fields are missing")
        }
        //
        //b.fetch problem from db
        const problem=await Problem.findById(problemId);
         //imp 
         //2.submit code on judge 0;  
        const languageId = getLanguageId(language);
       
         
        const submissions = problem.visibleTestCases.map((obj)=>({
            source_code:code,
            language_id:languageId,
            stdin:obj.input,
            expected_output:obj.output
        }));
         
        //.submit batch and got token
        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((obj)=>obj.token);
        //
        await new Promise(res => setTimeout(res,2000));
        //. submit token and get status id;
        const testResult = await submitToken(resultToken);
        // console.log(testResult);

         //
        return res.status(201).json(
                new apiresponse(201,testResult,"code run...")
            );
    }
    catch(err){
        throw new apierror(500,"error while submitting the problem");
    }    
}

export {runCode}



//console.log(testResult)
// [
//   {
//     stdout: '8',
//     time: '0.002',
//     memory: 884,
//     stderr: null,
//     token: 'e9bedbaf-4393-4c5f-826f-658de1a11cf7',
//     compile_output: null,
//     message: null,
//     status: { id: 3, description: 'Accepted' }
//   },
//   {
//     stdout: '9',
//     time: '0.003',
//     memory: 1124,
//     stderr: null,
//     token: '91f6275a-1b9c-4c2d-9993-df6038851204',
//     compile_output: null,
//     message: null,
//     status: { id: 3, description: 'Accepted' }
//   }
// ]

