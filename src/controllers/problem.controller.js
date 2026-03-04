import { submitBatch } from "../utils/submitbatch.js";
import getLanguageId from "../utils/languageid.js";

//1. create problem
async function createProblem(req,res) {
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
        const submissions=visibleTestCases.map((input,output)=>({
            source_code:completeCode,
            language_id:languageId,
            stdin:input,
            expected_output:output
        }))
        //submit a batch
       const submitResult=await submitBatch(submissions);
     }
}
export {createProblem};