const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const { validateClassifyPayload } = require('./lib/validation');

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const cache = new Map();

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    const err = new Error('OpenAI API key is not configured');
    err.statusCode = 503;
    throw err;
  }
  return new OpenAI({ apiKey });
}

function correlationIdMiddleware(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const requestId =
    typeof incoming === 'string' && incoming.trim().length > 0
      ? incoming.trim().slice(0, 128)
      : crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}

function trimCache() {
  if (cache.size > 1000) {
    const entries = Array.from(cache.entries());
    cache.clear();
    entries.slice(-500).forEach(([key, value]) => cache.set(key, value));
  }
}

function getReadinessState() {
  const apiKey = process.env.OPENAI_API_KEY;
  const openaiConfigured =
    typeof apiKey === 'string' &&
    apiKey.trim().length > 0 &&
    apiKey !== 'your_openai_api_key_here';

  return {
    status: openaiConfigured ? 'ready' : 'not_ready',
    checks: {
      openai_api_key: openaiConfigured,
    },
  };
}

function sendServerError(res, req, err) {
  console.error(`[${req.requestId}]`, err);
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.requestId,
    ...(isProduction ? {} : { detail: err.message }),
  });
}

app.use(cors());
app.use(express.json({ limit: '256kb' }));
app.use(correlationIdMiddleware);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/ready', (req, res) => {
  const readiness = getReadinessState();
  const statusCode = readiness.status === 'ready' ? 200 : 503;
  res.status(statusCode).json({
    ...readiness,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/classify', async (req, res) => {
  try {
    const validation = validateClassifyPayload(req.body);
    if (!validation.ok) {
      return res.status(400).json({
        error: validation.error,
        requestId: req.requestId,
      });
    }

    const { stem, choice, choices } = req.body;

    if (validation.mode === 'multiple') {
      const cacheKey = `${stem}|${choices.join('|')}`.toLowerCase();

      if (cache.has(cacheKey)) {
        return res.json({ correctIndex: cache.get(cacheKey) });
      }

      const choicesText = choices
        .map((choiceText, index) => `${index}: ${choiceText}`)
        .join('\n');

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

      const completion = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
        temperature: 0.0,
      });

      const response = completion.choices[0].message.content.trim();
      const correctIndex = parseInt(response.match(/\d+/)?.[0] || '0', 10);
      const validIndex =
        correctIndex >= 0 && correctIndex < choices.length ? correctIndex : 0;

      cache.set(cacheKey, validIndex);
      trimCache();

      return res.json({ correctIndex: validIndex });
    }

    const cacheKey = `${stem}|${choice}`.toLowerCase();

    if (cache.has(cacheKey)) {
      return res.json({ verdict: cache.get(cacheKey) });
    }

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

    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0.0,
    });

    const response = completion.choices[0].message.content.trim().toLowerCase();

    let verdict;
    if (response.includes('correct')) {
      verdict = 'correct';
    } else if (response.includes('incorrect')) {
      verdict = 'incorrect';
    } else {
      verdict = 'incorrect';
    }

    cache.set(cacheKey, verdict);
    trimCache();

    return res.json({ verdict });
  } catch (error) {
    if (error.statusCode === 503) {
      return res.status(503).json({
        error: 'Service unavailable',
        requestId: req.requestId,
      });
    }
    sendServerError(res, req, error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    requestId: req.requestId,
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`AI Study Assistant backend running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
    console.log(`Readiness: http://localhost:${port}/api/ready`);
  });
}

module.exports = app;
