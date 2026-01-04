# Pi AI Agent - Learning Intelligence System

## Overview

The Pi AI Agent is a hybrid client-side/API-based intelligence system that monitors student progress, identifies learning patterns, and provides personalized recommendations for the Pi math game.

## Features

### 🎯 Core Capabilities

1. **Performance Tracking**
   - Tracks accuracy, speed, and patterns for each operation (addition, subtraction, multiplication, division)
   - Maintains session history of last 100 problem attempts
   - Calculates real-time statistics and trends

2. **Pattern Recognition**
   - Identifies 20+ specific problem patterns across all operations
   - Examples:
     - Addition: carrying, large sums, single-digit problems
     - Subtraction: borrowing, negative results, large numbers
     - Multiplication: times tables, multiply by zero/one, large multiplication
     - Division: remainders, fractions, large division

3. **Adaptive Recommendations**
   - Generates personalized suggestions based on performance
   - Six types of recommendations:
     - **Practice**: Focus on weak operations
     - **Technique**: Improve specific patterns
     - **Achievement**: Celebrate strengths
     - **Challenge**: Advance when ready
     - **Support**: Guidance for struggling learners
     - **Strategy**: Time management tips

4. **AI-Enhanced Insights** (Optional)
   - Integrates with Claude API for advanced analysis
   - Provides natural language feedback and encouragement
   - Identifies subtle learning trends
   - Generates personalized coaching tips

### 📊 Progress Analytics

#### Operation Performance
- **Accuracy**: Percentage of correct answers per operation
- **Average Time**: Response speed for each operation type
- **Attempt Count**: Total problems solved per operation
- **Pattern Breakdown**: Detailed analysis of sub-skills within each operation

#### Weak Areas Detection
- Automatically identifies operations with < 60% accuracy (minimum 5 attempts)
- Highlights specific problem patterns that need practice
- Prioritizes recommendations based on frequency and accuracy

#### Strengths Recognition
- Celebrates operations with ≥ 80% accuracy (minimum 5 attempts)
- Identifies mastered problem patterns
- Encourages continued practice in strong areas

## Technical Architecture

### Client-Side Components

1. **PiAIAgent Class** ([ai-agent.js](ai-agent.js))
   - Main intelligence engine
   - Pure JavaScript, no external dependencies
   - Stores all data in browser localStorage
   - Zero server communication for core features

2. **Performance Data Structure**
```javascript
{
    operations: {
        addition: {
            attempted: 45,
            correct: 38,
            avgTime: 8.2,
            patterns: {
                carrying: { attempted: 12, correct: 9, avgTime: 10.5 },
                large_sums: { attempted: 8, correct: 7, avgTime: 12.1 }
            }
        }
    },
    sessionHistory: [...],  // Last 100 attempts
    weakAreas: [...],
    strengths: [...],
    lastAnalysis: {...}
}
```

3. **Integration Points**
   - Hooks into `submitAnswer()` to track each problem attempt
   - Saves data automatically via `saveProfileData()`
   - Loads data on profile selection via `selectProfile()`

### Progress Page

1. **progress.html** - Dedicated progress dashboard
2. **progress.css** - Styling for analytics visualizations
3. **progress.js** - UI logic and data rendering

#### Dashboard Sections

- **Overall Performance**: Accuracy, total problems, average response time
- **AI Insights**: AI-generated personalized feedback (optional)
- **Recommendations**: Actionable suggestions prioritized by importance
- **Performance by Operation**: Detailed stats for each math operation
- **Areas to Improve**: Weak patterns requiring focus
- **Your Strengths**: Mastered skills and achievements
- **Recent Activity**: Last 20 problem attempts with results

### Optional Claude API Integration

#### Setup
1. Navigate to "My Progress" page
2. Click "Enable AI-powered insights"
3. Enter Claude API key (obtain from https://console.anthropic.com/)
4. API key stored locally in browser (never sent to our servers)

#### How It Works
1. Client analyzes performance data locally
2. Sends anonymized summary to Claude API
3. Claude generates personalized insights
4. Response displayed in AI Insights section

#### Privacy & Security
- API key stored only in browser localStorage
- No personal information sent to Claude
- Only performance statistics transmitted
- User can disable AI features anytime
- All data remains local-first

## Usage Guide

### For Players

1. **Start Playing**: Just play the game normally - AI tracks automatically
2. **View Progress**: Click "📊 My Progress" button in the header
3. **Review Insights**: Check recommendations and weak areas
4. **Optional AI**: Add Claude API key for advanced insights
5. **Take Action**: Practice suggested operations or patterns

### For Parents/Teachers

1. **Monitor Progress**: Select child's profile in Progress page
2. **Identify Struggles**: Check "Areas to Improve" section
3. **Celebrate Success**: Review "Your Strengths" section
4. **Follow Recommendations**: Help implement suggested practice areas
5. **Track Trends**: Compare accuracy over time

### For Developers

#### Integrating AI Agent

```javascript
// Initialize AI agent
if (window.PiAIAgent) {
    aiAgent = new window.PiAIAgent();
    aiAgent.initialize(profileData);
}

// Track problem attempt
const timeTaken = (Date.now() - questionStartTime) / 1000;
aiAgent.trackAttempt(problemData, isCorrect, timeTaken);

// Analyze performance
const analysis = aiAgent.analyzePerformance();
console.log(analysis.weakOperations);
console.log(analysis.recommendations);

// Save to profile
const aiData = aiAgent.saveToProfile();
profile.aiAnalytics = aiData.aiAnalytics;
```

#### Adding Custom Patterns

Edit `identifyPattern()` in [ai-agent.js](ai-agent.js):

```javascript
identifyPattern(operation, num1, num2, answer) {
    if (operation === 'addition') {
        // Add custom pattern
        if (num1 > 1000 && num2 > 1000) {
            return 'very_large_addition';
        }
    }
    // ...existing patterns
}
```

Add description in `getPatternDescription()`:

```javascript
'very_large_addition': 'Addition with numbers over 1000'
```

## Data Privacy

### Local Storage Only
- All performance data stored in browser localStorage
- No data sent to external servers (except optional Claude API)
- Data persists only on the device being used
- Clearing browser data removes all progress

### What's Tracked
- Problem type and difficulty
- Correctness of answer
- Time taken to answer
- No personal identifying information
- No keystrokes or input behavior

### What's NOT Tracked
- User's actual answers (only correct/incorrect)
- Personal information
- Activity outside the game
- Device or browser information

## Performance Optimization

### Memory Usage
- Session history limited to last 100 attempts
- Pattern data aggregated (not storing individual problems)
- Efficient data structures minimize storage

### Speed
- Analysis runs in < 50ms for typical datasets
- No blocking operations
- Async Claude API calls don't freeze UI

## Future Enhancements

### Planned Features
- Visual progress charts and graphs
- Export progress reports (PDF/CSV)
- Difficulty auto-adjustment during gameplay
- Spaced repetition algorithm for weak patterns
- Multi-profile comparison for siblings
- Parent dashboard with email reports
- Problem generator tuned to weak areas

### API Improvements
- Support for other AI providers (OpenAI, Gemini)
- Local LLM integration (WebLLM)
- Voice feedback and encouragement
- Adaptive difficulty in real-time

## Troubleshooting

### Progress Not Showing
- Ensure you've solved at least 5-10 problems
- Check browser localStorage is enabled
- Try refreshing the progress page

### AI Insights Not Working
- Verify Claude API key is correct
- Check internet connection
- Ensure API key has sufficient credits
- Try regenerating insights

### Data Not Saving
- Check browser localStorage permissions
- Don't use incognito/private mode
- Clear browser cache if data seems corrupted

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- LocalStorage enabled
- Internet connection (only for Claude API features)

## Credits

**Author**: Kumar Srinivasan
**Email**: elangkuma.srinivasan@gmail.com
**Version**: 1.0
**License**: Free for educational use

## Support

For issues or questions:
1. Check this README
2. Review code comments in [ai-agent.js](ai-agent.js)
3. Contact: elangkuma.srinivasan@gmail.com

---

**Built with ❤️ for young learners** 🎓✨
