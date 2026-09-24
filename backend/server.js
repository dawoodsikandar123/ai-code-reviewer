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
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a code reviewer. Return ONLY valid JSON, no markdown, no extra text, in this exact shape:
{ "issues": [ { "line": number, "severity": "bug"|"security"|"performance"|"quality", "message": string, "suggestion": string } ] }

Language: ${language}

Code:
${code}`
                }
              ]
            }
          ]
        })
      }
    );

    const rawText = await response.text();
    console.log("STATUS:", response.status);
    console.log("BODY:", rawText.slice(0, 500));

    if (!response.ok) {
      return res.status(500).json({
        error: "AI request failed",
        status: response.status,
        details: rawText.slice(0, 300)
      });
    }

    const data = JSON.parse(rawText);
    let aiText = data.candidates[0].content.parts[0].text;

    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(aiText);
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
})