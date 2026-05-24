const express = require("express");

const app = express();
app.use(express.json({ limit: "50mb" }));

app.post("/transcribe", async (req, res) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai/whisper-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: req.body.inputs }),
      }
    );

    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy running");
});