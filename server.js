require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static('.'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/api/quote', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "Generate an inspiring and calming quote about mental health, peace, or mindfulness. Return in format: {quote: 'the quote', author: 'author name'}";

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        // Parse the response
        const quoteData = JSON.parse(text);
        res.json(quoteData);
    } catch (error) {
        console.error('Error generating quote:', error);
        res.status(500).json({
            quote: "Peace comes from within. Do not seek it without.",
            author: "Buddha"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
