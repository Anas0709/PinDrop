# AI Study Assistant Overlay 📚

A browser extension that helps students learn by providing AI-generated hints, explanations, and reasoning for study questions. This tool is designed to enhance understanding and learning, not to provide direct answers.

## What This Extension Does

The AI Study Assistant Overlay analyzes educational content you select on any webpage and provides:
- **Contextual hints** to guide your thinking
- **Step-by-step explanations** of concepts
- **Reasoning breakdowns** to help you understand the methodology
- **Learning-focused responses** that encourage understanding over memorization

This tool uses GPT-4o to generate educational content that helps you learn and understand problems, rather than simply giving answers.

## How It Works

1. **Select Study Content**: Highlight a question or problem along with its options on any webpage
2. **Request Assistance**: Activate the extension and click the assistant button
3. **Receive Learning Support**: The AI analyzes the content and provides hints, explanations, and reasoning to help you understand the concept
4. **Learn and Understand**: Use the provided information to work through the problem yourself

The extension uses an AI model (GPT-4o) via API to generate educational explanations and hints tailored to the content you've selected.

## Installation and Setup

### Step 1: Download the Extension Files

1. **Download this entire repository** to your computer
2. **Keep all files** in their original folder structure

### Step 2: Set Up the Backend Server

1. **Open Terminal/Command Prompt** on your computer
2. **Navigate to the backend folder**:
   ```
   cd path/to/Study-Assistant-Overlay/src/backend
   ```
   (Replace `path/to/Study-Assistant-Overlay` with the actual path where you saved the files)

3. **Install dependencies**:
   ```
   npm install
   ```

4. **Create your API key file**:
   - Create a new file called `.env` in the `src/backend` folder
   - Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   You can obtain an API key from [OpenAI](https://platform.openai.com/api-keys)

5. **Start the server**:
   ```
   npm start
   ```
   - You should see: "AI Study Assistant backend running on port 3000"
   - **Keep this terminal window open** while using the extension

### Step 3: Install the Extension in Chrome

1. **Open Google Chrome**
2. **Navigate to** `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in the top right)
4. **Click "Load unpacked"**
5. **Select the `src/frontend` folder** from your downloaded files
6. **The extension should now appear** in your extensions list

### Step 4: Using the Extension

1. **Navigate to any webpage** with study material or practice questions
2. **Activate the extension** by pressing `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - You'll see a small assistant button appear at the bottom center of your screen
3. **Select the question or problem** (highlight the question and all relevant options/content)
4. **Click the assistant button** to receive learning support
5. **Review the provided hints and explanations** to help you understand and solve the problem

## Visual Indicators

### The Assistant Button

- **Location**: Bottom center of your screen
- **Size**: Small (16px diameter)
- **Appearance**: White circle with subtle styling
- **Function**: Click after selecting study content to request learning assistance

### The Learning Indicator (Colored Dot)

- **Location**: Adjacent to the assistant button
- **Size**: Small (8px diameter)
- **Color**: Changes based on the type of response or hint category
- **Purpose**: Provides visual feedback about the type of learning support being offered

## Understanding the Visual Feedback

The colored indicator helps you quickly identify different types of learning support:

- 🟢 **Green** - Fundamental concepts or foundational information
- 🔵 **Blue** - Procedural steps or methodology hints
- 🟠 **Orange** - Important considerations or common pitfalls
- 🟣 **Purple** - Advanced concepts or deeper analysis
- 🔴 **Red** - Critical thinking points or attention areas

## Important Notes

- **Keep the server running** - Don't close the terminal window while using the extension
- **The extension remembers its state** - Once activated, it stays active even when you refresh the page
- **Works on any website** - Not limited to specific platforms
- **Designed for learning** - Focuses on understanding, not just answers

## Responsible Use

### Educational Purpose Only

This tool is designed to support learning and understanding. It does not provide direct answers but rather:
- Hints that guide your thinking process
- Explanations that help you understand concepts
- Reasoning breakdowns that teach methodology
- Learning-focused responses that encourage comprehension

### Intended Use Cases

- **Practice problems** and study questions
- **Homework assignments** when allowed by your instructor
- **Self-study** and concept review
- **Learning reinforcement** and understanding checks

### Not Intended For

- **Timed exams or assessments** where external assistance is prohibited
- **Graded assignments** where independent work is required
- **Academic dishonesty** or violating academic integrity policies
- **Bypassing learning objectives** of your courses

### Academic Integrity

**Always check with your instructor** about what resources are permitted for assignments and exams. This tool includes safeguards and is designed to support learning, but you are responsible for using it ethically and in accordance with your institution's academic policies.

**Remember**: The goal is understanding, not just completing assignments. Use this tool to learn and grow, not to avoid the learning process.

## Troubleshooting

### Extension Not Working?

1. **Check if the server is running** - Look for "AI Study Assistant backend running on port 3000" in your terminal
2. **Verify you activated the extension** - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. **Check your internet connection** - The extension needs to connect to the OpenAI API
4. **Verify your API key** - Ensure your OpenAI API key is correct in the `.env` file

### Can't See the Assistant Button?

- **Look at the bottom center** of your screen for a small white circle
- **Try hovering your mouse** over the bottom center area
- **Make sure the extension is activated** using the keyboard shortcut

### Not Getting Helpful Responses?

- **Ensure you selected the complete question** including all relevant content
- **Select from the beginning** of the question to the end of all options
- **Provide context** - Make sure your selection includes enough information for the AI to understand the question

## Getting Help

If you encounter issues:

1. **Check the browser console** - Press F12 and look for error messages
2. **Verify all files are downloaded correctly**
3. **Ensure your OpenAI API key is valid** in the `.env` file
4. **Check that Node.js is installed** (download from [nodejs.org](https://nodejs.org/))

## System Requirements

- **Google Chrome browser** (or Chromium-based browser)
- **OpenAI API key** (available from [OpenAI](https://platform.openai.com))
- **Node.js** installed on your computer (download from [nodejs.org](https://nodejs.org/))
- **Active internet connection** for API requests

## Development Notes

### AI-Assisted Development

This project was developed with the assistance of AI coding tools (such as Cursor) to accelerate development and iteration. However, all logic, architecture decisions, and implementation details were reviewed, understood, and tested by the developer to ensure quality and functionality.

### Project Structure

```
Study-Assistant-Overlay/
├── src/
│   ├── backend/          # Node.js server for AI API integration
│   └── frontend/         # Chrome extension files
├── README.md             # This file
└── .gitignore           # Git ignore rules
```

## License

MIT License - See LICENSE file for details

---

**Happy Learning! 📚✨**
