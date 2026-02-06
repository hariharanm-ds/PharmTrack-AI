// src/utils/askGPT.js

import axios from 'axios';

export const askGPT = async (userMessage) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an AI doctor assistant. Respond clearly and calmly with first-aid advice or medical suggestions when appropriate.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: "https://openrouter.ai/api/v1/chat/completions", // replace with actual OpenRouter API key
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ GPT Error:", error.message);
    return "Sorry, I couldn't connect to the AI right now. Try again later.";
  }
};
