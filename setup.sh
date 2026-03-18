#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# AI Study Assistant Overlay Installation Script

echo "📚 AI Study Assistant Overlay Setup"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$SCRIPT_DIR/src/backend"
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Environment file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit src/backend/.env and add your OpenAI API key"
    echo "   Get your API key from: https://platform.openai.com/api-keys"
else
    echo "✅ Environment file found"
fi
cd "$SCRIPT_DIR"

echo ""
echo "🚀 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit src/backend/.env and add your OpenAI API key"
echo "2. Start the backend server:"
echo "   cd src/backend && npm start"
echo ""
echo "3. Install the browser extension:"
echo "   - Open Chrome/Edge and go to chrome://extensions/"
echo "   - Enable 'Developer mode'"
echo "   - Click 'Load unpacked' and select the src/frontend folder"
echo ""
echo "4. Test the extension:"
echo "   - Open test.html in your browser"
echo "   - Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux) to activate"
echo "   - Highlight a study question and click the assistant button"
echo ""
echo "Happy learning! 📚✨"
