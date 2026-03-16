import axios from "axios";

async function submitBatch(submissions) {
  try {

    const response = await axios.post(
      "https://ce.judge0.com/submissions/batch",
      { submissions },
      {
        params: {
          base64_encoded: "false"
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error) {
    console.log(
      "Error in submitBatch:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export { submitBatch };