// index.js
const express = require('express');
require('dotenv').config();
const OpenAI = require('openai');
const path = require('path');
const cors = require('cors'); // Add this line

const app = express();

app.use(express.json());
app.use(cors()); // Add this line to enable CORS
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summarize", async (req, res) => {
    try {
        const { text } = req.body;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that summarizes articles concisely, given a title and a summary of an article. Limit your response to 200 characters or less." },
                { role: "user", content: `Please provide a concise summary of the following text in 200 characters or less:\n\n${text}` },
            ],
            max_tokens: 150,
            temperature: 0.5,
        });

        return res.status(200).json({
            success: true,
            summary: response.choices[0].message.content.trim(),
        });
    } catch (error) {
        const statusCode = error instanceof OpenAI.APIError ? error.status : 500;
        const errorMessage = error instanceof OpenAI.APIError ? error.message : "There was an issue on the server";

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
        });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
