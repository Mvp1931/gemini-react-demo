import express from "express";
import cors from "cors";
import process from "process";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { config } from "dotenv";
config();

const port = process.env.PORT || 9090;

const app = express();
app.use(cors());
app.use(express.json());

const geminiKey = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = geminiKey.getGenerativeModel({
    model: "gemini-1.0-pro",
});

app.post("/gemini/", async (req, res) => {
    const chat = model.startChat({
        history: req.body.history,
        parts: req.body.parts,
    });
    const message = req.body.message;

    const result = await chat.sendMessage(message);
    const response = result.response;
    const modelResponse = await response.text();
    console.log(`response is (printing on server)${modelResponse}`);

    const modelParts = [{ text: modelResponse }];
    res.send(modelParts);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
