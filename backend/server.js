const express = require("express");

const app = express();
const PORT = 3000;

// JSON request body ko read karne ke liye
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.json({
    message: "AI Code Reviewer backend is running"
  });
});

// Code review ka endpoint
app.post("/review", (req, res) => {
  const { code, language } = req.body;

  // Basic validation
  if (!code || !language) {
    return res.status(400).json({
      error: "Code and language are required"
    });
  }

  // Abhi sirf test ke liye received data return kar rahe hain
  res.json({
    message: "Code received successfully",
    language: language,
    code: code
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});