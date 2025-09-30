# Micro-Pin Answerer 🎯

**1 million dollars to stay 24 hours alone in a room with the professor and his husband are you doing it?**

A browser extension that helps you get the correct answers to multiple-choice questions by using AI analysis.

## What This Extension Does

This extension analyzes multiple-choice questions and shows you a colored dot indicating the correct answer. It works on any website, including Canvas quizzes, and uses GPT-4o for accurate results.

## How to Install and Use

### Step 1: Download the Extension Files

1. **Download this entire folder** to your computer
2. **Make sure you have all the files** in one folder (don't rename anything)

### Step 2: Set Up the Backend Server

1. **Open Terminal/Command Prompt** on your computer
2. **Navigate to the backend folder** by typing:
   ```
   cd path/to/your/downloaded/folder/src/backend
   ```
   (Replace `path/to/your/downloaded/folder` with the actual path where you saved the files)

3. **Install the required software** by typing:
   ```
   npm install
   ```

4. **Create your API key file**:
   - Create a new file called `.env` in the `src/backend` folder
   - Add this exact line to the file (I've provided the API key for you):
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the server** by typing:
   ```
   npm start
   ```
   - You should see: "Micro-Pin Answerer backend running on port 3000"
   - **Keep this window open** - don't close it while using the extension

### Step 3: Install the Extension in Chrome

1. **Open Google Chrome**
2. **Go to** `chrome://extensions/`
3. **Turn on "Developer mode"** (toggle in the top right)
4. **Click "Load unpacked"**
5. **Select the `src/frontend` folder** from your downloaded files
6. **The extension should now appear** in your extensions list

### Step 4: Using the Extension

1. **Go to any website** with multiple-choice questions (like Canvas)
2. **Activate the extension** by pressing `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
   - You'll see a tiny white circle appear at the bottom center of your screen
3. **Select the question text** (highlight the question and all answer choices)
4. **Click the tiny white circle** at the bottom
5. **A colored dot will appear** next to the white circle showing the correct answer

## Where to Find the Elements

### The Button (White Circle)
- **Location**: Bottom center of your screen
- **Size**: Very small (16px) - barely noticeable
- **Color**: White with light gray border
- **What it does**: Click this after selecting question text to analyze it

### The Answer Dot (Colored Circle)
- **Location**: Right next to the white button
- **Size**: Even smaller (8px)
- **Color**: Changes based on the correct answer
- **What it shows**: The correct answer choice

## Color Legend

### For Multiple Choice Questions (A, B, C, D):
- 🟢 **Green** = A (1st choice)
- 🔵 **Blue** = B (2nd choice)
- 🟠 **Orange** = C (3rd choice)
- 🟣 **Purple** = D (4th choice)
- 🔴 **Red** = E (5th choice, if applicable)

### For True/False Questions:
- 🟢 **Green** = True/Yes/Correct
- 🔴 **Red** = False/No/Incorrect

## Important Notes

- **Keep the server running** - Don't close the terminal window while using the extension
- **The extension remembers its state** - Once activated, it stays active even when you refresh the page
- **Works on any website** - Not just Canvas
- **Very subtle design** - The elements are barely noticeable and won't interfere with your work

## Troubleshooting

### Extension Not Working?
1. **Check if the server is running** - Look for "Micro-Pin Answerer backend running on port 3000" in your terminal
2. **Make sure you activated the extension** - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
3. **Check your internet connection** - The extension needs to connect to OpenAI

### Can't See the Button?
- **Look at the bottom center** of your screen for a tiny white circle
- **It's very small and subtle** - you might need to look carefully
- **Try hovering your mouse** over the bottom center area

### Wrong Answers?
- **Make sure you selected the complete question** including all answer choices
- **Try selecting from the beginning** of the question to the end of the last choice
- **The AI is very accurate** but occasionally might make mistakes

## Getting Help

If you have any issues:
1. **Check the console** - Press F12 and look for error messages
2. **Make sure all files are downloaded** correctly
3. **Verify your OpenAI API key** is correct in the `.env` file

## What You Need

- **Google Chrome browser**
- **OpenAI API key** (get one from openai.com)
- **Node.js installed** on your computer (download from nodejs.org)
- **Basic computer skills** (opening terminal, downloading files)

---

**Enjoy using Micro-Pin Answerer! 🎯**