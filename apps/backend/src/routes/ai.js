import express from "express";
import { generateAIResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const reply = await generateAIResponse(message);

    res.json({
      success: true,
      reply
    });

  } catch (err) {
    console.error("AI Route Error:", err.message);

    res.status(500).json({
      success: false,
      message: "AI error"
    });
  }
});

export default router;