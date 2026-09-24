const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// JSON requests read karne ke liye
app.use(express.json());

// Frontend ki files serve karne ke liye
app.use(express.static(path.join(__dirname, "../frontend")));

// Code review endpoint
app.post("/review", (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({
      error: "Code and language are required"
    });
  }

  res.json({
    message: "Code received successfully",
    language,
    code
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});