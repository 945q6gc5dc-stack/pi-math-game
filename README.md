# Pi - Practice Intelligence Math Game

A fun and interactive web application designed to help children improve their math skills through engaging problem-solving exercises with adaptive difficulty levels.

## Features

### 🎯 Core Functionality
- **Multiple User Profiles**: Create and manage individual profiles for different users
- **Gender-Based Avatars**: Choose between boy and girl avatars with emotional expressions
- **Grade-Based Curriculum**: Tailored math problems for Grades 1-10 (Ages 6-16)
- **Adaptive Difficulty**: 10 levels per grade with decreasing time limits as you progress
- **Four Operations**: Addition, Subtraction, Multiplication, and Division (based on grade level)
- **Real-time Feedback**: Instant validation with encouraging messages and visual feedback
- **Timer System**: Countdown timer with visual progress bar for each question

### 📊 Progress Tracking
- **Score System**: Earn points for correct answers
  - Base points: 10 per correct answer
  - Speed bonus: +5 points for fast answers (75% of time remaining)
  - Level bonus: Additional points based on current level
- **Level Progression**: Advance through 10 levels with increasing difficulty
- **Crown Rewards**: Earn crowns based on performance
  - 3 crowns: Perfect score (10/10)
  - 2 crowns: Great score (8-9/10)
  - 1 crown: Good score (7/10)
- **Session Statistics**:
  - Total problems attempted
  - Total correct answers
  - Accuracy percentage
  - Best streak

### 🎭 Avatar Emotion System
- **Dynamic Emotions**: Avatars display emotions based on performance
  - Excited: 80%+ accuracy
  - Happy: 66-79% accuracy
  - Neutral: 50-65% accuracy
  - Shocked: 30-49% accuracy
  - Sad: Below 30% accuracy
- **Smooth Transitions**: Animated emotion changes with overlay effects
- **Profile Cards**: Show overall performance emotion on profile selection

### 📚 Grade-Specific Curriculum

**Grade 1 (Ages 6-7)**
- Operations: Addition, Subtraction
- Number Range: 0-20
- No negative numbers

**Grade 2 (Ages 7-8)**
- Operations: Addition, Subtraction
- Number Range: 0-100
- No negative numbers

**Grade 3 (Ages 8-9)**
- Operations: Addition, Subtraction, Multiplication
- Number Range: 0-100
- Multiplication: 0-10 tables

**Grade 4 (Ages 9-10)**
- Operations: All four operations
- Number Range: 0-144
- Multiplication: 0-12 tables

**Grade 5 (Ages 10-11)**
- Operations: All four operations
- Number Range: 0-500
- Multiplication: 0-15 tables

**Grades 6-10 (Ages 11-16)**
- Operations: All four operations with negative numbers
- Progressively larger number ranges
- Advanced multiplication tables

### 🎨 Visual Features
- **Gradient Animations**: Animated gradient effects on π symbol and "Mission" text
- **Theme-Adaptive Favicon**: Automatically adjusts color based on browser theme (light/dark mode)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Celebratory animations for correct answers, shake effects for incorrect ones

### 💾 Data Persistence
- **Local Storage**: All progress is automatically saved in the browser
- **Profile Management**: Create, select, and delete user profiles
- **Session Continuity**: Resume from where you left off
- **No Server Required**: Complete privacy - no data sent to external servers

## How to Use

1. **Open the Application**
   - Open `index.html` in any modern web browser
   - No installation or server setup required

2. **Create a Profile**
   - Click "+ Add New Profile"
   - Enter your name (up to 20 characters)
   - Choose your avatar (boy or girl)
   - Click "Create"

3. **Select Grade Level**
   - Choose the appropriate grade level (1-10)
   - The difficulty and operations will adjust automatically

4. **Start Playing**
   - Click "Start Mission" to begin a 10-question quiz
   - Each question has a time limit (30 seconds at level 1, decreasing with each level)
   - Type your answer and press Enter or click the submit button
   - Watch your avatar's emotions change based on your performance

5. **Progress Through Levels**
   - Score 7 or more correct answers to advance to the next level
   - Earn crowns for good performance
   - Complete all 10 levels to become a Math Master!

## Files Structure

```
pi/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # Game logic and interactivity
├── avatars/        # Avatar images and icons
│   ├── boy-*.png   # Boy avatar emotions
│   ├── girl-*.png  # Girl avatar emotions
│   ├── crown.png   # Crown icon
│   ├── send.png    # Submit button icon
│   └── continue.png # Continue button icon
└── README.md       # This file
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Responsive Design

The website is fully responsive and works on:
- Desktop computers (1024px and above)
- Tablets (768px - 1024px)
- Mobile phones (up to 768px)

## Educational Benefits

This application helps children:
- Practice arithmetic operations appropriate for their grade level
- Improve mental math speed and accuracy
- Build confidence with progressive difficulty levels
- Track their progress with visual feedback
- Stay motivated through rewards (crowns) and level progression
- Develop problem-solving skills in a fun, game-like environment
- Learn to manage time with countdown timers

## Tips for Parents/Teachers

- Start with the appropriate grade level for the child's age
- Encourage daily practice sessions (10-20 minutes)
- Celebrate crown achievements and level completions
- Use the accuracy metric to identify areas needing improvement
- Monitor the avatar emotions as indicators of confidence and performance
- Allow children to progress at their own pace through the levels
- Consider creating separate profiles for multiple children to track individual progress

## Privacy & Data

All data is stored locally in the browser using localStorage. No information is sent to any server or third party. Profiles and progress are saved on the device being used.

## Technical Features

- **Gradient Animations**: CSS keyframe animations with background-clip text effects
- **SVG Favicon**: Theme-adaptive icon using CSS media queries
- **Overlay Animation System**: Dual-layer avatar system for smooth emotion transitions
- **Responsive Grid Layouts**: Flexbox-based layouts that adapt to screen size
- **Local Storage API**: Browser-based data persistence
- **Event-Driven Architecture**: Efficient JavaScript event handling

## Future Enhancements (Ideas)

- Sound effects for correct/incorrect answers
- More avatar options and customization
- Word problems and story-based math
- Fractions, decimals, and percentages for higher grades
- Printable progress reports
- Timed challenge mode with leaderboards
- Parent dashboard for tracking multiple children
- Export/import profile data

## Author

**Kumar Srinivasan**
Email: elangkuma.srinivasan@gmail.com

## License

Free to use for educational purposes.

---

**Have fun mastering math with Pi!** 🎉📚✨
