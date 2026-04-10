import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import agentConfig from './config/agent-personality.js';

const app = express();
const upload = multer();
const genai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Semua pengaturan sudah terpusat
const config = agentConfig;

app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});

app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await genai.models.generateContent({
            model: config.model,
            config: {                                   // ← bungkus di sini
                systemInstruction: config.systemInstruction,
                temperature: config.generationConfig.temperature,
                maxOutputTokens: config.generationConfig.maxOutputTokens,
            },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            // systemInstruction: config.systemInstruction,
            tools: config.tools,
            // generationConfig: config.generationConfig,
        });
        console.log("success generate-text");
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        // 1. Cek jika jatah harian/bulanan habis (Quota Exceeded)
        if ((errorMessage.includes("quota") || errorMessage.includes("QUOTA_EXCEEDED")) && errorMessage.includes("429")) {
            res.status(429).json({
                type: "QUOTA_LIMIT",
                message: config.name + " sudah sangat lelah. Tunggu besok atau hubungi admin untuk info lebih lanjut.",
                detail: "Daily quota exhausted."
            });
        }else if ((!errorMessage.includes("quota") || !errorMessage.includes("QUOTA_EXCEEDED")) && errorMessage.includes("429")) {
            res.status(429).json({
                type: "TOO_MANY_REQUESTS",
                message: "Kamu mengetik terlalu cepat. Pelan-pelan ya karena " + config.name + " juga butuh waktu untuk berpikir.",
                detail: "Too many requests. Please slow down."
            });
        }else if(errorMessage.includes("UNAVAILABLE") || errorMessage.includes("UNAVAILABLE") || errorMessage.includes("503")) {
            res.status(503).json({
                type: "SERVICE_UNAVAILABLE",
                message: "Sebentar, " + config.name + " sedang sibuk. Coba lagi nanti ya.",
                detail: "Service is currently unavailable."
            });
        }else{
            res.status(500).json({
                type: "INTERNAL_ERROR",
                message: "Duh maaf, " + config.name + " lagi ada masalah nih. Coba lagi nanti ya. " + e.message,
                detail: "Internal server error. Please try again later."
            });
        }
    }
});

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString('base64');

    try {
        const response = await genai.models.generateContent({
            model: MODEL,
            contents: [
                { text: prompt, type: 'text' },
                { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
            ]
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message});
    }
});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString('base64');

    try {
        const response = await genai.models.generateContent({
            model: MODEL,
            contents: [
                { text: prompt ?? "Tolong buat ringkasan dokumen berikut", type: 'text' },
                { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
            ]
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message});
    }
});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString('base64');

    try {
        const response = await genai.models.generateContent({
            model: MODEL,
            contents: [
                { text: prompt ?? "Tolong buat transkrip dari rekaman berikut", type: 'text' },
                { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
            ]
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message});
    }
});