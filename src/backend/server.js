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

// Learning assistance endpoint
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
      
      // Prepare the prompt for OpenAI to provide learning hints and explanations
      const choicesText = choices.map((choice, index) => `${index}: ${choice}`).join('\n');
      
      const prompt = `You are an educational tutor helping a student learn. Your task is to provide hints and explanations to help the student understand the question and work through it themselves.

Question: "${stem}"

Answer Choices:
${choicesText}

Instructions:
- Analyze the question and all answer choices carefully
- Provide learning-focused guidance, not direct answers
- Help the student understand the concepts involved
- Consider which choice would be most educational to explain (the correct one, but frame it as a learning opportunity)
- Focus on the reasoning process and methodology
- This appears to be an academic/business question - use your knowledge to provide educational context
- Determine which choice (by index number) would be most beneficial for the student to understand through explanation
- Respond with ONLY the index number (0, 1, 2, 3, etc.) of the choice that would provide the best learning opportunity
- Do not provide explanations or reasoning in this response - just the index number
- Focus on which choice would teach the student the most about the underlying concept

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
      
      // Prepare the prompt for OpenAI to provide learning guidance
      const prompt = `You are an educational tutor. Your task is to help a student learn by providing guidance about an answer choice.

Question: "${stem}"

Answer Choice: "${choice}"

Instructions:
- Analyze the question and the specific answer choice from an educational perspective
- Help the student understand whether this choice demonstrates correct understanding
- Focus on learning outcomes, not just correctness
- Respond with ONLY one word: "correct" if this choice shows good understanding of the concept, or "incorrect" if it doesn't
- Do not provide explanations or reasoning in this response
- Base your evaluation on educational value and concept understanding

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
  console.log(`AI Study Assistant backend running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});

module.exports = app;
