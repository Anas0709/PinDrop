const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Cache to avoid duplicate API calls
const cache = new Map();

// Classification endpoint
app.post('/api/classify', async (req, res) => {
  try {
    const { stem, choice, choiceIndex, choices } = req.body;
    
    // Handle new format: find correct answer from all choices
    if (choices && Array.isArray(choices)) {
      if (!stem) {
        return res.status(400).json({ error: 'Missing required field: stem' });
      }
      
      // Create cache key for all choices
      const cacheKey = `${stem}|${choices.join('|')}`.toLowerCase();
      
      // Check cache first
      if (cache.has(cacheKey)) {
        return res.json({ correctIndex: cache.get(cacheKey) });
      }
      
      // Prepare the prompt for OpenAI to find the correct answer
      const choicesText = choices.map((choice, index) => `${index}: ${choice}`).join('\n');
      
      const prompt = `You are an expert at evaluating multiple-choice questions. Your task is to identify which answer choice is correct.

Question: "${stem}"

Answer Choices:
${choicesText}

Instructions:
- Analyze the question and all answer choices carefully
- Even if the question seems incomplete or missing context, use your knowledge to determine the most likely correct answer
- Consider the question type (fill-in-the-blank, multiple choice, etc.)
- This appears to be an academic/business question - use your knowledge of business, IT, and general academic subjects
- Determine which choice (by index number) is the correct answer
- Respond with ONLY the index number (0, 1, 2, 3, etc.) of the correct answer
- Do not provide explanations, reasoning, or additional text
- Base your evaluation on factual accuracy and logical consistency

Response:`;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Upgraded to GPT-4o for better accuracy
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.0, // Zero temperature for maximum consistency
      });
      
      const response = completion.choices[0].message.content.trim();
      
      // Extract the index number
      const correctIndex = parseInt(response.match(/\d+/)?.[0] || '0');
      
      // Validate the index is within range
      const validIndex = correctIndex >= 0 && correctIndex < choices.length ? correctIndex : 0;
      
      // Cache the result
      cache.set(cacheKey, validIndex);
      
      res.json({ correctIndex: validIndex });
      
    } else {
      // Handle old format: single choice verification
      if (!stem || !choice) {
        return res.status(400).json({ error: 'Missing required fields: stem and choice' });
      }
      
      // Create cache key
      const cacheKey = `${stem}|${choice}`.toLowerCase();
      
      // Check cache first
      if (cache.has(cacheKey)) {
        return res.json({ verdict: cache.get(cacheKey) });
      }
      
      // Prepare the prompt for OpenAI
      const prompt = `You are an expert at evaluating multiple-choice questions. Your task is to determine if a given answer choice is correct or incorrect for a question.

Question: "${stem}"

Answer Choice: "${choice}"

Instructions:
- Analyze the question and the specific answer choice
- Determine if this choice is correct or incorrect
- Respond with ONLY one word: "correct" or "incorrect"
- Do not provide explanations, reasoning, or additional text
- Base your evaluation on factual accuracy and logical consistency

Response:`;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Upgraded to GPT-4o for better accuracy
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.0, // Zero temperature for maximum consistency
      });
      
      const response = completion.choices[0].message.content.trim().toLowerCase();
      
      // Validate response
      let verdict;
      if (response.includes('correct')) {
        verdict = 'correct';
      } else if (response.includes('incorrect')) {
        verdict = 'incorrect';
      } else {
        // Fallback if response is unclear
        verdict = 'incorrect';
      }
      
      // Cache the result
      cache.set(cacheKey, verdict);
      
      res.json({ verdict });
    }
    
    // Clean up cache periodically (keep last 1000 entries)
    if (cache.size > 1000) {
      const entries = Array.from(cache.entries());
      cache.clear();
      entries.slice(-500).forEach(([key, value]) => cache.set(key, value));
    }
    
  } catch (error) {
    console.error('Error in classification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Micro-Pin Answerer backend running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});

module.exports = app;
