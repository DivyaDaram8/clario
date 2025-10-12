const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const BASE_URL = "https://api.apyhub.com/sharpapi/api/v1/content";

// ---------------- Text summarization ----------------
const summarizeText = async (req, res) => {
  try {
    const { text, language = "en", length = "short" } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    // Submit job
    const submitRes = await axios.post(
      `${BASE_URL}/summarize`,
      { type: "text", content: text, language, length },
      {
        headers: {
          "apy-token": process.env.APY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const jobId = submitRes.data?.job_id;
    if (!jobId) throw new Error("No job ID received");
    // console.log("✅ Text summarization job started:", jobId);

    // Poll for result
    let summary = null;
    for (let i = 0; i < 10; i++) {
      const statusRes = await axios.get(
        `${BASE_URL}/summarize/job/status/${jobId}`,
        { headers: { "apy-token": process.env.APY_TOKEN } }
      );

      const data = statusRes.data?.data?.attributes;
      const status = data?.status;

      if (status === "success") {
        summary = data?.result?.summary;
        break;
      }
      if (status === "failed") throw new Error("Job failed to process");
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!summary) throw new Error("Summary not ready in time");
    res.json({ summary });
  } catch (err) {
    // console.error("Text summarizer error:", err.message);
    res.status(500).json({ error: "Failed to summarize text" });
  }
};

// ---------------- Document summarization ----------------
const summarizeDocs = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    // console.log("Uploaded file info:", req.file);

    // Build multipart/form-data
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), req.file.originalname);
    form.append("summary_length", req.body.summary_length || "short");
    form.append("output_language", req.body.output_language || "en");

    // console.log("Sending file to ApyHub with:", {
    //   file: req.file.originalname,
    //   summary_length: req.body.summary_length || "short",
    //   output_language: req.body.output_language || "en",
    // });

    const response = await axios.post(
      "https://api.apyhub.com/ai/summarize-documents/file",
      form,
      { headers: { ...form.getHeaders(), "apy-token": process.env.APY_TOKEN } }
    );

    fs.unlinkSync(req.file.path); // cleanup
    res.json(response.data);
  } catch (err) {
    // console.error("Docs summarizer error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to summarize document",
      details: err.response?.data || err.message,
    });
  }
};

module.exports = { summarizeText, summarizeDocs };
