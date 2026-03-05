
import axios from "axios";

async function waiting(timer) {
    setTimeout(()=>{
      return 1;
    },timer)
}
async function submitToken(resultToken) {

    const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        tokens:resultToken.join(","),
        base64_encoded: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': 'd0a9875736msh06989435b077922p1df3b4jsnff8f2f60b207',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

  while(true){
    const result=await   fetchData();

    const IsResultObtained= result.submissions.every((r)=>r.status_id>2) ;
    if(IsResultObtained){
        return result.submissions;
    }
   await waiting(1000)
}

}

export {submitToken}