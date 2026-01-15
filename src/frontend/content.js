// Content script for AI Study Assistant Overlay
class StudyAssistantOverlay {
  constructor() {
    this.indicators = new Map();
    this.isActive = this.getStoredState(); // Load persisted state
    this.backendUrl = 'http://localhost:3000/api/classify';
    this.cache = new Map();
    this.justPlacedIndicator = false; // Flag to prevent immediate removal
    
    this.init();
  }
  
  getStoredState() {
    try {
      const stored = localStorage.getItem('study-assistant-active');
      return stored === 'true';
    } catch (error) {
      return false;
    }
  }
  
  setStoredState(isActive) {
    try {
      localStorage.setItem('study-assistant-active', isActive.toString());
    } catch (error) {
      console.log('❌ Could not save state to localStorage');
    }
  }
  
  init() {
    console.log('📚 AI Study Assistant initialized');
    
    // If extension was active before refresh, reactivate it
    if (this.isActive) {
      console.log('🔄 Restoring extension state - was active before refresh');
      this.addFloatingButton();
    }
    
    // Check for iframes and inject into them
    this.injectIntoIframes();
    
    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('📨 Message received:', request);
      if (request.action === 'togglePins') {
        console.log('🔄 Toggling assistant via message');
        this.toggleAssistant();
        sendResponse({active: this.isActive});
      } else if (request.action === 'checkStatus') {
        console.log('❓ Status check requested');
        sendResponse({active: this.isActive});
      }
    });
    
    // Listen for keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Support both Mac (Cmd+Shift+P) and Windows/Linux (Ctrl+Shift+P)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
        console.log('⌨️ Keyboard shortcut detected:', e.metaKey ? 'Cmd+Shift+P' : 'Ctrl+Shift+P');
        e.preventDefault();
        this.toggleAssistant();
      }
      
      
      // Remove indicator: Press Escape
      if (e.key === 'Escape') {
        console.log('⌨️ Escape pressed - removing indicator');
        e.preventDefault();
        this.removeLegend();
      }
    });
    
    // Listen for text selection (disabled for multiple choice - use button only)
    document.addEventListener('mouseup', (e) => {
      if (this.isActive) {
        // Only auto-process True/False questions, require button for multiple choice
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          const text = selection.toString().trim();
          const lines = text.split('\n').map(line => line.trim()).filter(line => line);
          
          // Check if it's a True/False question
          const trueFalsePatterns = [/^(true|false)$/i, /^(yes|no)$/i, /^(correct|incorrect)$/i];
          const hasTrueFalse = lines.some(line => 
            trueFalsePatterns.some(pattern => pattern.test(line))
          );
          
          if (hasTrueFalse) {
            console.log('🎯 Auto-processing True/False question');
            this.handleTextSelection();
          } else {
            console.log('📝 Multiple choice detected - please use the button');
          }
        }
      }
    });
    
    // Listen for clicks elsewhere to remove indicators
    document.addEventListener('click', (e) => {
      // Only remove indicators if clicking outside of indicators and not the button
      if (this.isActive && !e.target.classList.contains('micro-pin') && e.target.id !== 'micro-pin-button') {
        console.log('🖱️ Clicked elsewhere - removing indicator');
        this.removeLegend(); // Remove the colored dot when clicking anywhere else
      }
    });
    
    // Also listen for any mouse movement to check if text is still selected
    document.addEventListener('mousemove', () => {
      if (this.isActive) {
        const selection = window.getSelection();
        if (selection.toString().trim().length === 0) {
          // Check if there's an indicator but no selection
          const existingDot = document.getElementById('micro-pin-dot');
          if (existingDot) {
            console.log('🖱️ Mouse moved with no selection - removing indicator');
            this.removeLegend();
          }
        }
      }
    });
    
    // Listen for selection changes to remove indicators
    document.addEventListener('selectionchange', () => {
      if (this.isActive) {
        const selection = window.getSelection();
        if (selection.toString().trim().length === 0) {
          console.log('📝 Text unselected - removing indicator');
          setTimeout(() => {
            this.removeLegend(); // Remove the colored dot when text is unselected
          }, 100);
        }
      }
    });
    
    // Listen for scroll to remove indicators (but keep the button)
    document.addEventListener('scroll', () => {
      if (this.isActive) {
        this.removeLegend();
        // Don't remove the floating button on scroll
      }
    });
    
    // Listen for copy events (when user copies text)
    document.addEventListener('copy', (e) => {
      if (this.isActive) {
        setTimeout(() => {
          this.handleCopiedText();
        }, 100);
      }
    });
    
    // Listen for clicks on indicators
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('micro-pin')) {
        e.preventDefault();
        e.stopPropagation();
        this.handleIndicatorClick(e.target);
      }
    });
  }
  
  toggleAssistant() {
    this.isActive = !this.isActive;
    this.setStoredState(this.isActive); // Persist the state
    console.log('🔄 Extension is now:', this.isActive ? 'ACTIVE' : 'INACTIVE');
    if (!this.isActive) {
      this.deactivateExtension();
    } else {
      this.addFloatingButton();
    }
  }
  
  deactivateExtension() {
    console.log('🔌 Deactivating extension - removing everything');
    this.indicators.forEach(indicator => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    });
    this.indicators.clear();
    this.removeLegend();
    this.removeFloatingButton();
  }
  
  handleTextSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const text = selection.toString().trim();
    console.log('📝 Text selected:', text.substring(0, 50) + '...');
    
    if (text.length < 10) return; // Too short to be a question
    
    const parsed = this.parseQuestion(text);
    console.log('🔍 Parsed question:', parsed);
    
    if (parsed.choices.length < 2) {
      console.log('❌ Not enough choices found:', parsed.choices.length);
      return; // Need at least 2 choices
    }
    
    console.log('✅ Processing study content with', parsed.choices.length, 'options');
    this.removeAllIndicators();
    this.placeIndicators(parsed);
  }
  
  parseQuestion(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    console.log('📋 All lines:', lines);
    
    // Check for True/False questions first
    const trueFalsePatterns = [
      /^(true|false)$/i,
      /^(yes|no)$/i,
      /^(correct|incorrect)$/i
    ];
    
    const hasTrueFalse = lines.some(line => 
      trueFalsePatterns.some(pattern => pattern.test(line))
    );
    
    if (hasTrueFalse) {
      console.log('🎯 Detected True/False question');
      const choices = lines.filter(line => 
        trueFalsePatterns.some(pattern => pattern.test(line))
      );
      const stem = lines.filter(line => 
        !trueFalsePatterns.some(pattern => pattern.test(line))
      ).join(' ');
      
      return { stem, choices, choiceLines: choices, isTrueFalse: true };
    }
    
    // For Canvas-style questions, try a different approach
    // Look for traditional choice patterns first
    let stemEndIndex = 0;
    const choicePatterns = [
      /^[A-D]\)\s/,  // A) B) C) D)
      /^\d+\.\s/,    // 1. 2. 3. 4.
      /^[•·▪▫]\s/,   // Bullet points
      /^[a-d]\)\s/,  // a) b) c) d)
      /^[A-D]\.\s/,  // A. B. C. D.
      /^\d+\)\s/,    // 1) 2) 3) 4)
      /^[A-D]\s/,    // A B C D (without punctuation)
      /^\d+\s/       // 1 2 3 4 (without punctuation)
    ];
    
    // First, try to find choices with traditional prefixes
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isChoice = choicePatterns.some(pattern => pattern.test(line));
      if (isChoice) {
        stemEndIndex = i;
        break;
      }
    }
    
    // If no traditional choice patterns found, use Canvas-style parsing
    if (stemEndIndex === 0) {
      console.log('🔍 No traditional choice patterns found, using Canvas-style parsing');
      console.log('📏 All lines:', lines.map((line, i) => `${i}: "${line}" (${line.length} chars)`));
      
      // Remove headers but keep everything else
      const filteredLines = lines.filter(line => {
        // Skip lines that look like question headers
        if (/^Question\s+\d+/i.test(line)) return false;
        if (/^\d+\s*\/\s*\d+\s*pts?/i.test(line)) return false;
        if (/^\d+\s*points?/i.test(line)) return false;
        return true;
      });
      
      console.log('📋 Filtered lines (removed headers):', filteredLines);
      
      // For Canvas questions, assume first line is question, rest are choices
      console.log('📏 Canvas-style: Using first line as question, rest as choices');
      stemEndIndex = 1; // Question is first line, choices start from second
      
      const stem = filteredLines[0]; // First line is the question
      const choiceLines = filteredLines.slice(1); // Rest are choices
      
      const choices = choiceLines.map(line => line.trim()).filter(choice => choice.length > 0);
      
      console.log('🎯 Parsed result:', { stem, choices, choiceLines });
      console.log('📊 Parsing details:');
      console.log('  - Total lines:', filteredLines.length);
      console.log('  - Stem end index:', stemEndIndex);
      console.log('  - Stem:', stem);
      console.log('  - Choice lines:', choiceLines);
      console.log('  - Final choices:', choices);
      
      return { stem, choices, choiceLines, isTrueFalse: false };
    }
    
    // Traditional parsing for questions with A), B), C), D) format
    const stem = lines.slice(0, stemEndIndex).join(' ');
    const choiceLines = lines.slice(stemEndIndex);
    
    const choices = choiceLines.map(line => {
      // Remove choice prefix if it exists
      return line.replace(/^[A-D]\)\s|^\d+\.\s|^[•·▪▫]\s|^[a-d]\)\s|^[A-D]\.\s|^\d+\)\s|^[A-D]\s|^\d+\s/, '').trim();
    }).filter(choice => choice.length > 0);
    
    console.log('🎯 Parsed result:', { stem, choices, choiceLines });
    console.log('📊 Parsing details:');
    console.log('  - Total lines:', lines.length);
    console.log('  - Stem end index:', stemEndIndex);
    console.log('  - Stem:', stem);
    console.log('  - Choice lines:', choiceLines);
    console.log('  - Final choices:', choices);
    
    return { stem, choices, choiceLines, isTrueFalse: false };
  }
  
  async placeIndicators(parsed) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    // Remove any existing legend
    this.removeLegend();
    
    // Send all choices to backend to get learning guidance
    try {
      console.log('🔍 Getting learning guidance for:', parsed.stem);
      const suggestedChoiceIndex = await this.getStudyResponse(parsed.stem, parsed.choices);
      console.log('✅ Suggested learning focus index:', suggestedChoiceIndex);
      
      if (suggestedChoiceIndex !== -1) {
        console.log('🎯 Creating learning indicator for', parsed.choices.length, 'options');
        this.createColorLegend(parsed.choices, suggestedChoiceIndex, parsed.isTrueFalse);
      } else {
        console.log('❌ Could not generate learning guidance');
      }
    } catch (error) {
      console.error('Error getting study response:', error);
    }
  }
  
  findChoicePosition(choiceText, textNodes, range) {
    // More robust approach: find text node containing the choice
    for (const textNode of textNodes) {
      const text = textNode.textContent;
      const index = text.indexOf(choiceText);
      
      if (index !== -1) {
        const range = document.createRange();
        range.setStart(textNode, index);
        range.setEnd(textNode, index + choiceText.length);
        
        const rect = range.getBoundingClientRect();
        
        // Only return position if we found a valid bounding box
        if (rect.width > 0 && rect.height > 0) {
          return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height
          };
        }
      }
    }
    
    // Fallback: try to find by looking for choice patterns in the selection
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const selectionRange = selection.getRangeAt(0);
      const container = selectionRange.commonAncestorContainer;
      
      // Look for the choice text in the container
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent;
        const index = text.indexOf(choiceText);
        
        if (index !== -1) {
          const range = document.createRange();
          range.setStart(node, index);
          range.setEnd(node, index + choiceText.length);
          
          const rect = range.getBoundingClientRect();
          
          if (rect.width > 0 && rect.height > 0) {
            return {
              x: rect.left + window.scrollX,
              y: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height
            };
          }
        }
      }
    }
    
    return null;
  }
  
  createIndicator(index) {
    const indicator = document.createElement('div');
    indicator.className = 'micro-pin';
    indicator.innerHTML = '●';
    indicator.dataset.index = index;
    return indicator;
  }
  
  async getStudyResponse(stem, choices) {
    // Check cache first
    const cacheKey = `${stem}|${choices.join('|')}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    try {
      const response = await fetch(this.backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stem: stem,
          choices: choices
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const suggestedIndex = result.correctIndex;
      
      // Cache the result
      this.cache.set(cacheKey, suggestedIndex);
      
      return suggestedIndex;
      
    } catch (error) {
      console.error('Error getting study response:', error);
      return -1; // Return -1 if error
    }
  }

  async handleIndicatorClick(indicator) {
    const choiceIndex = parseInt(indicator.dataset.choiceIndex);
    const choiceText = indicator.dataset.choiceText;
    const stem = indicator.dataset.stem;
    
    // Check cache first
    const cacheKey = `${stem}|${choiceText}`;
    if (this.cache.has(cacheKey)) {
      this.updateIndicatorColor(indicator, this.cache.get(cacheKey));
      return;
    }
    
    // Show loading state
    indicator.classList.add('loading');
    
    try {
      const response = await fetch(this.backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stem: stem,
          choice: choiceText,
          choiceIndex: choiceIndex
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const verdict = result.verdict;
      
      // Cache the result
      this.cache.set(cacheKey, verdict);
      
      // Update indicator color
      this.updateIndicatorColor(indicator, verdict);
      
    } catch (error) {
      console.error('Error calling backend:', error);
      indicator.classList.add('error');
      indicator.title = 'Error: Could not get learning guidance';
    } finally {
      indicator.classList.remove('loading');
    }
  }
  
  updateIndicatorColor(indicator, verdict) {
    pin.classList.remove('loading', 'error');
    
    if (verdict === 'correct') {
      pin.classList.add('correct');
      pin.title = 'Correct';
    } else if (verdict === 'incorrect') {
      pin.classList.add('incorrect');
      pin.title = 'Incorrect';
    }
  }
  
  createColorLegend(choices, suggestedIndex, isTrueFalse = false) {
    // Color scheme for learning indicators
    const colors = [
      '#4CAF50', // Green for A/1
      '#2196F3', // Blue for B/2  
      '#FF9800', // Orange for C/3
      '#9C27B0', // Purple for D/4
      '#F44336'  // Red for E/5
    ];
    
    // Special colors for True/False questions
    const trueFalseColors = {
      'true': '#4CAF50',    // Green for True
      'false': '#F44336',   // Red for False
      'yes': '#4CAF50',     // Green for Yes
      'no': '#F44336',      // Red for No
      'correct': '#4CAF50', // Green for Correct
      'incorrect': '#F44336' // Red for Incorrect
    };
    
    // Create single dot indicator
    const dot = document.createElement('div');
    dot.className = 'micro-pin-dot';
    dot.id = 'micro-pin-dot';
    
    // Determine color based on question type
    let dotColor;
    if (isTrueFalse) {
      const suggestedAnswer = choices[suggestedIndex].toLowerCase();
      dotColor = trueFalseColors[suggestedAnswer] || colors[suggestedIndex];
      console.log('🎯 True/False question - learning focus:', suggestedAnswer, 'color:', dotColor);
    } else {
      dotColor = colors[suggestedIndex] || colors[0];
      console.log('🎯 Multiple choice question - learning focus index:', suggestedIndex, 'color:', dotColor);
    }
    
    dot.style.backgroundColor = dotColor;
    
    document.body.appendChild(dot);
    console.log('✅ Learning indicator created for option', suggestedIndex);
  }
  
  removeLegend() {
    const existingDot = document.getElementById('micro-pin-dot');
    if (existingDot) {
      existingDot.remove();
      console.log('🗑️ Dot removed');
    }
  }
  
  injectIntoIframes() {
    // Find all iframes and inject the extension into them
    const iframes = document.querySelectorAll('iframe');
    console.log('🔍 Found', iframes.length, 'iframes');
    
    iframes.forEach((iframe, index) => {
      try {
        // Try to access iframe content
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          console.log('📄 Injecting into iframe', index);
          this.setupIframeListeners(iframeDoc);
        }
      } catch (error) {
        console.log('❌ Cannot access iframe', index, 'due to CORS policy');
      }
    });
  }
  
  setupIframeListeners(iframeDoc) {
    // Set up the same event listeners in the iframe
    iframeDoc.addEventListener('mouseup', (e) => {
      if (this.isActive) {
        console.log('📝 Mouse up in iframe');
        setTimeout(() => {
          const selection = iframeDoc.getSelection();
          if (selection && selection.toString().trim().length > 0) {
            console.log('📝 Text selected in iframe:', selection.toString().substring(0, 50));
            this.handleTextSelection();
          }
        }, 100);
      }
    });
    
    iframeDoc.addEventListener('selectionchange', () => {
      if (this.isActive) {
        const selection = iframeDoc.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          console.log('📝 Selection changed in iframe:', selection.toString().substring(0, 50));
          this.handleTextSelection();
        }
      }
    });
    
    iframeDoc.addEventListener('click', (e) => {
      if (this.isActive && !e.target.classList.contains('micro-pin')) {
        const selection = iframeDoc.getSelection();
        if (selection && selection.toString().trim().length === 0) {
          this.removeAllIndicators();
        }
      }
    });
  }
  
  handleCopiedText() {
    console.log('📋 Copy event detected');
    
    // Get the copied text from clipboard
    navigator.clipboard.readText().then(copiedText => {
      if (copiedText && copiedText.trim().length > 0) {
        console.log('📝 Copied text:', copiedText.substring(0, 100) + '...');
        
        // Parse the copied text as a question
        const parsed = this.parseQuestion(copiedText);
        console.log('🔍 Parsed copied question:', parsed);
        
        if (parsed.choices.length >= 2) {
          console.log('✅ Processing copied question with', parsed.choices.length, 'options');
          this.removeAllIndicators();
          this.placeIndicators(parsed);
        } else {
          console.log('❌ Copied text doesn\'t appear to be a question with multiple choices');
        }
      }
    }).catch(error => {
      console.log('❌ Could not read clipboard:', error);
    });
  }
  
  manualTrigger() {
    console.log('🔧 Manual trigger activated');
    
    // Store the selected text before any click events can interfere
    let selectedText = '';
    
    // Try to get selection from main window first
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      selectedText = selection.toString().trim();
      console.log('📝 Found selection in main window:', selectedText.substring(0, 100));
    } else {
      // Try to get selection from iframes
      const iframes = document.querySelectorAll('iframe');
      console.log('🔍 Checking', iframes.length, 'iframes for selection');
      
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc) {
            console.log(`🔍 Checking iframe ${i} for selection`);
            const iframeSelection = iframeDoc.getSelection();
            if (iframeSelection && iframeSelection.toString().trim().length > 0) {
              selectedText = iframeSelection.toString().trim();
              console.log('📝 Found selection in iframe', i, ':', selectedText.substring(0, 100));
              console.log('📝 Full iframe selection length:', selectedText.length);
              console.log('📝 Full iframe selection:', selectedText);
              break;
            } else {
              console.log(`🔍 No selection found in iframe ${i}`);
            }
          }
        } catch (error) {
          console.log(`❌ Cannot access iframe ${i} due to CORS policy`);
        }
      }
    }
    
    if (selectedText.length > 0) {
      console.log('✅ Processing manual selection - taking time to analyze...');
      // Process immediately with the captured text
      this.processSelectedText(selectedText);
    } else {
      console.log('❌ No text selected - please select some text first');
    }
  }
  
  getCurrentSelection() {
    console.log('🔍 Getting current selection...');
    
    // Try to get selection from main window first
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      console.log('📝 Found selection in main window:', selection.toString().substring(0, 100));
      return selection.toString().trim();
    }
    
    // Try to get selection from iframes
    const iframes = document.querySelectorAll('iframe');
    console.log('🔍 Checking', iframes.length, 'iframes for selection');
    
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          console.log(`🔍 Checking iframe ${i} for selection`);
          const iframeSelection = iframeDoc.getSelection();
          if (iframeSelection && iframeSelection.toString().trim().length > 0) {
            const text = iframeSelection.toString().trim();
            console.log('📝 Found selection in iframe', i, ':', text.substring(0, 100));
            return text;
          } else {
            console.log(`🔍 No selection found in iframe ${i}`);
          }
        }
      } catch (error) {
        console.log(`❌ Cannot access iframe ${i} due to CORS policy`);
      }
    }
    
    console.log('❌ No selection found anywhere');
    return '';
  }
  
  processSelectedText(text) {
    console.log('📝 Processing text:', text.substring(0, 100) + '...');
    console.log('📝 Full text length:', text.length);
    
    if (text.length < 10) {
      console.log('❌ Text too short to be a question');
      return; // Too short to be a question
    }
    
    const parsed = this.parseQuestion(text);
    console.log('🔍 Parsed question:', parsed);
    
    if (parsed.choices.length < 2) {
      console.log('❌ Not enough choices found:', parsed.choices.length);
      return; // Need at least 2 choices
    }
    
    console.log('✅ Processing study content with', parsed.choices.length, 'options');
    this.removeAllIndicators();
    this.placeIndicators(parsed);
  }
  
  addFloatingButton() {
    // Remove existing button if any
    const existingButton = document.getElementById('micro-pin-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    // Create floating button
    const button = document.createElement('div');
    button.id = 'micro-pin-button';
    button.innerHTML = '';
    button.title = 'Get Learning Assistance';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 50%;
      transform: translateX(50%);
      width: 16px;
      height: 16px;
      background: white;
      color: #666;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10000;
      font-size: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border: 1px solid #f0f0f0;
      transition: all 0.2s ease;
      opacity: 0.5;
    `;
    
    // Capture text on mousedown before click can interfere
    button.addEventListener('mousedown', (e) => {
      console.log('🔘 Button mousedown - capturing text');
      this.capturedText = this.getCurrentSelection();
      console.log('📝 Captured text on mousedown:', this.capturedText.substring(0, 100));
    });
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔘 Floating button clicked');
      
      // Use the text captured on mousedown
      if (this.capturedText && this.capturedText.length > 0) {
        console.log('📝 Using captured text:', this.capturedText.substring(0, 100));
        this.processSelectedText(this.capturedText);
        this.capturedText = ''; // Clear after use
      } else {
        console.log('❌ No text was captured - please select some text first');
      }
    });
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateX(50%) scale(1.2)';
      button.style.opacity = '0.8';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateX(50%) scale(1)';
      button.style.opacity = '0.5';
    });
    
    document.body.appendChild(button);
    console.log('✅ Floating button added');
  }
  
  removeFloatingButton() {
    const button = document.getElementById('micro-pin-button');
    if (button) {
      button.remove();
      console.log('🗑️ Floating button removed');
    }
  }
  
  removeAllIndicators() {
    console.log('🗑️ Removing all indicators, count:', this.indicators.size);
    this.indicators.forEach(indicator => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    });
    this.indicators.clear();
    this.removeLegend();
    // Don't remove the floating button here - it should stay visible when extension is active
  }
}

// Initialize the extension
new StudyAssistantOverlay();
