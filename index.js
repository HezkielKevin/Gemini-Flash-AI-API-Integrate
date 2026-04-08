import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = 'gemini-3-flash-preview'; // Ganti dengan model yang sesuai

app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});

app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await genai.models.generateContent({
            model: model,
            contents: prompt
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message});
    }
});