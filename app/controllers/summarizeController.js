// app/controllers/summarizeController.js
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.summarizeText = async (req, res) => {
    try {
        const { text } = req.body;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes articles concisely, given a title and a summary of an article. Limit your response to 200 characters or less."
                },
                {
                    role: "user",
                    content: `Please provide a concise summary of the following text in 200 characters or less:\n\n${text}`
                },
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
};
