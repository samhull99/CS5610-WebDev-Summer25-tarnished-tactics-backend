import dotenv from 'dotenv';
import OpenAI from "openai";

// Load environment variables from .env file
dotenv.config();

console.log("API Key loaded:", process.env.OPENAI_API_KEY ? "✅ Yes" : "❌ No");
console.log("First 10 chars:", process.env.OPENAI_API_KEY?.substring(0, 10));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

try {
  console.log("🚀 Making API request...");
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user", 
        content: "Tell me a three sentence bedtime story about a unicorn."
      }
    ],
    max_tokens: 100
  });
  
  console.log("✅ Success!");
  console.log("Response:", response.choices[0].message.content);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Error code:", error.code);
}