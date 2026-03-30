import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const { message } = req.body;

  try {
const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a compassionate assistant helping families document psychiatric care histories clearly for new doctors. Never diagnose. Never recommend treatment." },
      { role: "user", content: message }
    ]
  })
});

    const data = await response.json();

    if (!response.ok) {
      console.error("API error: Failed to get response from AI");
      return res.status(500).json({
        reply: data.error?.message || "API error"
      });
    }

const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Invalid API response:", data);
      return res.status(500).json({
        reply: "Invalid response from AI"
      });
    }

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
