import axios from "axios";

async function submitToken(tokens) {
  try {

    const response = await axios.get(
      "https://ce.judge0.com/submissions/batch",
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: "false"
        }
      }
    );

    return response.data.submissions;

  } catch (error) {
    console.log(
      "Error in submitToken:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export { submitToken };