require("dotenv").config();

const express = require("express");
const path = require("path");
const { saveReview, getHistory, getReviewById } = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ── POST /review ──────────────────────────────────────────────────────
app.post("/review", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({
      error: "Code and language are required"
    });
  }

  const prompt = `You are an expert code reviewer.

Review the following code for bugs, security vulnerabilities, performance problems, and code-quality issues.

Return ONLY valid JSON.
Do not use markdown.
Do not add any explanation outside the JSON.

Use exactly this format:

{
  "issues": [
    {
      "line": 1,
      "severity": "bug",
      "message": "Description of the issue",
      "suggestion": "How to fix it"
    }
  ]
}

Allowed severity values:
bug
security
performance
quality

Language:
${language}

Code:
${code}`;

  const callGemini = async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );
    const rawText = await response.text();
    return { status: response.status, ok: response.ok, rawText };
  };

  try {
    let result = await callGemini();

    let attempts = 1;
    let delay = 1500;
    while (!result.ok && result.status === 503 && attempts < 5) {
      console.log(`Attempt ${attempts} failed with 503, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      result = await callGemini();
      attempts++;
      delay *= 2;
    }

    console.log("STATUS:", result.status);
    console.log("BODY:", result.rawText.slice(0, 2000));

    if (!result.ok) {
      return res.status(500).json({
        error: "AI request failed",
        status: result.status,
        details: result.rawText.slice(0, 500)
      });
    }

    const data = JSON.parse(result.rawText);
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      return res.status(500).json({
        error: "AI returned an empty response"
      });
    }

    const parsed = JSON.parse(aiText);
    const issues = parsed.issues || [];

    // Calculate counts and score (mirrors frontend logic)
    const counts = { bug: 0, security: 0, performance: 0, quality: 0 };
    for (const issue of issues) {
      if (counts[issue.severity] !== undefined) counts[issue.severity]++;
    }
    const penalty =
      counts.bug * 15 +
      counts.security * 20 +
      counts.performance * 10 +
      counts.quality * 5;
    const score = Math.max(0, 100 - penalty);

    // Persist to SQLite
    const reviewId = saveReview({ language, score, counts, issues });
    console.log(`Review saved: id=${reviewId}, score=${score}, issues=${issues.length}`);

    res.json({ ...parsed, id: reviewId, score });

  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({
      error: "Something went wrong",
      details: err.message
    });
  }
});

// ── GET /history ──────────────────────────────────────────────────────
app.get("/history", (req, res) => {
  try {
    const rows = getHistory();
    res.json(rows);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Could not fetch history" });
  }
});

// ── GET /history/:id ──────────────────────────────────────────────────
app.get("/history/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid id" });
  }
  try {
    const review = getReviewById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    console.error("History/:id error:", err);
    res.status(500).json({ error: "Could not fetch review" });
  }
});

// ── Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
