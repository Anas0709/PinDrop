# Architecture Overview

This repo contains two parts:

- `src/frontend/`: A Chrome extension (Manifest V3) that injects a content script into webpages.
- `src/backend/`: An Express server that calls the OpenAI API.

## User flow

1. User installs the extension and toggles the assistant (keyboard shortcut or popup button).
2. The content script watches for text selection / copy events.
3. When a multiple-choice question is detected, the content script sends the parsed question + choices to the backend.
4. The backend classifies which choice is most educational to focus on (by index).
5. The content script renders a small on-page indicator (dot) to guide the student.

## Backend endpoints

- `POST /api/classify`: Returns a choice index (`correctIndex`) for multiple-choice questions.
- `POST /api/classify` (legacy format): Can return a `verdict` of `correct` / `incorrect` for single-choice checks.
- `GET /api/health`: Liveness probe (process is up).
- `GET /api/ready`: Readiness probe (returns 503 if `OPENAI_API_KEY` is missing).

All API responses include an `X-Request-Id` header for request correlation.

## Key implementation notes

- The backend uses a small in-memory `Map` cache to reduce repeated API calls.
- The frontend uses lightweight heuristics to parse question/choice text from selected content.
- The extension is intended for educational support, not to replace independent learning.

