import axios from "axios";

export const generateAIResponse = async (message, history = "") => {
  try {
  const prompt = `
You are SkillBridge AI assistant.

Instructions:
- Answer ONLY the question given below
- Do NOT create a conversation
- Do NOT write "User:" or "Assistant:"
- Do NOT repeat or invent new questions
- Keep answer short and clear (3-5 lines)

Question: ${message}

Answer:
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "tinyllama",
        prompt,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 150,   // 🔥 increase this
          stop: ["User:", "Assistant", "Question:"]
        }
      }
    );

    return response.data.response;

  } catch (error) {
    console.error("AI Service Error:", error.message);
    return "⚠️ AI is not responding right now.";
  }
};