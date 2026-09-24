require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/review", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  try {
    const response = await fetch("https://api.us-east.bob.ibm.com/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Apikey ${process.env.BOB_API_KEY}`
      },
      body: JSON.stringify({
        model: "premium",
        messages: [
          {
            role: "developer",
            content: "You are a code reviewer. Return ONLY valid JSON in this exact shape: { \"issues\": [ { \"line\": number, \"severity\": \"bug\"|\"security\"|\"performance\"|\"quality\", \"message\": string, \"suggestion\": string } ] }. No extra text."
          },
          {
            role: "user",
            content: `Language: ${language}\n\nCode:\n${code}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Bob API error:", data);
      return res.status(500).json({ error: "AI request failed", details: data });
    }

    const aiText = data.choices[0].message.content;
    const parsed = JSON.parse(aiText);

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});