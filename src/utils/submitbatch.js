import axios from "axios"
import getLanguageId from "./languageid.js"

async function submitBatch(submissions) {
    
    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'false'
    },
    headers: {
        'x-rapidapi-key': 'd0a9875736msh06989435b077922p1df3b4jsnff8f2f60b207',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        submissions
     }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            // console.log(response.data);
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

   return await fetchData();

}

export {submitBatch}


