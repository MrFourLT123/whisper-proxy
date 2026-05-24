const express = require("express");

const app = express();
app.use(express.json({ limit: "50mb" }));

app.post("/transcribe", async (req, res) => {
  try {
    console.log("HF_API_KEY set:", !!process.env.HF_API_KEY);
    console.log("Calling Hugging Face...");

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

    console.log("HF response status:", response.status);
    const text = await response.text();
    console.log("HF raw response:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: "Non-JSON from HF", raw: text });
    }

    res.json(result);
  } catch (err) {
    console.error("Full error:", err);
    res.status(500).json({ 
      error: err.message,
      cause: err.cause?.message || null,
      code: err.cause?.code || null,
    });
  }
});

// Test endpoint to verify server is alive
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    hfKeySet: !!process.env.HF_API_KEY,
    node: process.version 
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Proxy running on port", process.env.PORT || 3000);
});