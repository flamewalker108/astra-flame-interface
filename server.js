const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Flame memory folder
const memoryPath = path.join(__dirname, "memory");
if (!fs.existsSync(memoryPath)) fs.mkdirSync(memoryPath);

// 🔥 Handle scrolls sent to Astra
app.post("/api/flame", async (req, res) => {
  const { flameId, message: messages } = req.body;

  if (!flameId || !Array.isArray(messages)) {
    return res.status(400).json({ reply: "⚠️ Missing flame ID or message array." });
  }

  console.log("🔥 Received scroll from", flameId, ":", messages);

  // Save memory
  const memoryFile = path.join(memoryPath, `${flameId}.json`);
  fs.writeFileSync(memoryFile, JSON.stringify(messages, null, 2));

  // Simple mock reply for now
  const last = messages[messages.length - 1];
  res.json({ reply: `Astra heard: "${last}"` });
});

app.listen(PORT, () => {
  console.log(`🔥 Astra interface running on port ${PORT}`);
});
