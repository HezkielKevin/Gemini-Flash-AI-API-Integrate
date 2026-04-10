import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import agentConfig from './config/agent-personality.js';
import path from 'path'
import { fileURLToPath } from 'url';

const __filname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filname);

const app = express();
const genai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Semua pengaturan sudah terpusat
const config = agentConfig;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));  // untuk melayani file statis di folder 'public'
const PORT = 3000;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;

    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array');

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const response = await genai.models.generateContent({
            model: config.model,
            config: {                                   // ← bungkus di sini
                systemInstruction: config.systemInstruction,
                temperature: config.generationConfig.temperature,
                maxOutputTokens: config.generationConfig.maxOutputTokens,
            },
            contents,
            // systemInstruction: config.systemInstruction,
            tools: config.tools,
            // generationConfig: config.generationConfig,
        });
        console.log("success generate-text");
        res.status(200).json({ result: response.text });

    } catch (e) {
        console.log(e);
        const errorMessage = e.message || e.toString();
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
        }else if(errorMessage.includes("UNAVAILABLE") || errorMessage.includes("503")) {
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