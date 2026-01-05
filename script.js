/**
 * Pi - Practice Intelligence Math Game
 * Author: Kumar Srinivasan (elangkuma.srinivasan@gmail.com)
 * A fun and interactive math game for children to improve their arithmetic skills
 */

// Game state
let currentProfile = null;
let profiles = {};
let currentLevel = 1;
let maxLevelAchieved = 1; // Track the maximum level achieved to prevent regression when replaying lower levels
let currentQuestion = 0;
let quizQuestions = [];
let quizCorrect = 0;
let quizScore = 0;
let totalScore = 0;
let totalAttempted = 0;
let totalCorrect = 0;
let bestStreak = 0;
let totalCrowns = 0;
let timerInterval = null;
let timeRemaining = 0;
let timePerQuestion = 30;
let selectedOperation = 'mixed'; // Track selected operation type
let avatarGender = 'boy'; // Track current avatar gender
let currentEmotion = 'neutral'; // Track current emotion state for smooth transitions
let emotionAnimationInterval = null; // Track animation interval for looping
let aiAgent = null; // AI agent for progress tracking and personalization
let questionStartTime = 0; // Track when question was shown

// Number Pad State (Mobile Only)
let numberPadValue = '';
let isNumberPadActive = false;

// Avatar options for profiles
const avatars = ['👦', '👧', '🧒', '👨', '👩', '🧑', '👶', '🐶', '🐱', '🦁', '🐼', '🦊', '🐸', '🦄', '🐢', '🐙'];

// DOM elements
const profileSelection = document.getElementById('profile-selection');
const gameContainer = document.getElementById('game-container');
const profileList = document.getElementById('profile-list');
const addProfileBtn = document.getElementById('add-profile-btn');
const profileModal = document.getElementById('profile-modal');
const profileNameInput = document.getElementById('profile-name-input');
const createProfileBtn = document.getElementById('create-profile-btn');
const cancelProfileBtn = document.getElementById('cancel-profile-btn');
const currentPlayerName = document.getElementById('current-player-name');
const currentGradeDesktop = document.getElementById('current-grade-desktop');
const changeProfileBtn = document.getElementById('change-profile-btn');
const totalCrownsDisplay = document.getElementById('total-crowns');
// Mobile player info elements
const currentPlayerNameMobile = document.getElementById('current-player-name-mobile');
const currentGradeMobile = document.getElementById('current-grade-mobile');
const changeProfileBtnMobile = document.getElementById('change-profile-btn-mobile');
const totalCrownsMobile = document.getElementById('total-crowns-mobile');
const viewProgressBtnMobile = document.getElementById('view-progress-btn-mobile');
// π navigation buttons
const piNavBtn = document.getElementById('pi-nav-btn');
const piNavBtnQuiz = document.getElementById('pi-nav-btn-quiz');

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const scoreBoardRow = document.querySelector('.score-board-row');
const startBtn = document.getElementById('start-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const problemDisplay = document.getElementById('problem');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const feedbackDiv = document.getElementById('feedback');
const feedbackAnswerDiv = document.getElementById('feedback-answer');
const feedbackDivDesktop = document.getElementById('feedback-desktop');
const feedbackAnswerDivDesktop = document.getElementById('feedback-answer-desktop');
const gradeSelect = document.getElementById('grade');
const levelDisplay = document.getElementById('level');
const levelMissionText = document.getElementById('level-mission-text');
const questionCounterDisplay = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const timerBar = document.getElementById('timer-bar');
const totalAttemptedDisplay = document.getElementById('total-attempted');
const totalCorrectDisplay = document.getElementById('total-correct');
const accuracyDisplay = document.getElementById('accuracy');
const bestStreakDisplay = document.getElementById('best-streak');
const quizCorrectDisplay = document.getElementById('quiz-correct');
const quizScoreDisplay = document.getElementById('quiz-score');
const quizAccuracyDisplay = document.getElementById('quiz-accuracy');
const crownsEarnedDisplay = document.getElementById('crowns-earned');
const crownRewardContainer = document.querySelector('.crown-reward');
const levelUpMessage = document.getElementById('level-up-message');
const nextTimeDisplay = document.getElementById('next-time');
const startTimeDisplay = document.getElementById('start-time-display');
const avatarImageBase = document.getElementById('avatar-image-base');
const avatarImageOverlay = document.getElementById('avatar-image-overlay');
const avatarCorrectDisplay = document.getElementById('avatar-correct');
// Mobile avatar elements
const mobileAvatarImage = document.getElementById('mobile-avatar-image');
const mobileAvatarCorrect = document.getElementById('mobile-avatar-correct');
const resultsHeading = document.getElementById('results-heading');
const levelUpSection = document.getElementById('level-up-section');
const levelUpHeading = document.getElementById('level-up-heading');
const levelUpText = document.getElementById('level-up-text');
const piSymbol = document.querySelector('.pi-nav-button');
const playAgainBtn = document.getElementById('play-again-btn');
const viewMapBtn = document.getElementById('view-map-btn');
const viewMapBtnStart = document.getElementById('view-map-btn-start');
// Desktop level-up elements (duplicates for stats-panel placement)
const levelUpSectionDesktop = document.getElementById('level-up-section-desktop');
const levelUpHeadingDesktop = document.querySelector('.level-up-heading-desktop');
const levelUpTextDesktop = document.querySelector('.level-up-text-desktop');
const nextTimeDisplayDesktop = document.querySelector('.next-time-desktop');
const nextLevelBtnDesktop = document.querySelector('.next-level-btn-desktop');
const playAgainBtnDesktop = document.querySelector('.play-again-btn-desktop');
const viewMapBtnDesktop = document.querySelector('.view-map-btn-desktop');
const levelMapModal = document.getElementById('level-map-modal');
const closeMapBtn = document.getElementById('close-map-btn');
const levelMapContainer = document.getElementById('level-map-container');
const mapGradeDisplay = document.getElementById('map-grade');
const prevGradeBtn = document.getElementById('prev-grade-btn');
const nextGradeBtn = document.getElementById('next-grade-btn');
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const deleteAvatarImage = document.getElementById('delete-avatar-image');
const deleteProfileName = document.getElementById('delete-profile-name');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const operationLegend = document.getElementById('operation-legend');
const legendIcon = document.getElementById('legend-icon');
const legendText = document.getElementById('legend-text');
const viewProgressBtnDesktop = document.getElementById('view-progress-btn-desktop');

// Track currently displayed grade in map modal
let displayedGrade = 3;

// Track profile to delete
let profileToDelete = null;

// Initialize the game
function init() {
    loadProfiles();

    // Check if returning from progress page with context
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    const profileId = urlParams.get('profile');

    if (source && profileId && profiles[profileId]) {
        // Auto-load the profile - this handles showing game container
        selectProfile(profileId);

        // Navigate to the correct screen based on source
        if (source === 'quiz') {
            // Show quiz screen (user was mid-quiz)
            startScreen.classList.add('hidden');
            resultsScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');

            // Show score-board during quiz
            const playerInfoRow = document.querySelector('.player-info-row');
            if (playerInfoRow) playerInfoRow.style.display = 'none';
            if (scoreBoardRow) scoreBoardRow.style.display = 'flex';
            if (viewMapBtnStart) viewMapBtnStart.classList.add('hidden');

            // Restore quiz state from sessionStorage
            const savedQuiz = sessionStorage.getItem('pi-quiz-state');
            if (savedQuiz) {
                const quizData = JSON.parse(savedQuiz);

                // Restore quiz variables
                currentQuestion = quizData.currentQuestion;
                quizCorrect = quizData.quizCorrect;
                quizScore = quizData.quizScore;
                quizAttempted = quizData.quizAttempted;
                currentStreak = quizData.currentStreak;
                timeRemaining = quizData.timeRemaining;

                // Update displays
                progressDisplay.textContent = `${currentQuestion}/10`;
                scoreDisplay.textContent = quizScore;

                // Restart timer from saved time
                startTimer();

                // Show next question
                showNextQuestion();

                // Clean up sessionStorage
                sessionStorage.removeItem('pi-quiz-state');
            }
        } else if (source === 'results') {
            // Show results screen (user was viewing results)
            startScreen.classList.add('hidden');
            quizScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');

            const playerInfoRow = document.querySelector('.player-info-row');
            if (playerInfoRow) playerInfoRow.style.display = 'flex';
            if (scoreBoardRow) scoreBoardRow.style.display = 'none';
            if (viewMapBtnStart) viewMapBtnStart.classList.add('hidden');

            // Restore results screen data from sessionStorage
            const savedResults = sessionStorage.getItem('pi-results-state');
            if (savedResults) {
                const resultsData = JSON.parse(savedResults);

                // Restore quiz results variables
                quizCorrect = resultsData.quizCorrect;
                quizScore = resultsData.quizScore;
                currentLevel = resultsData.currentLevel;
                maxLevelAchieved = resultsData.maxLevelAchieved;

                // Update result displays
                const accuracy = Math.round((quizCorrect / 10) * 100);
                quizCorrectDisplay.textContent = `${quizCorrect}/10`;
                quizScoreDisplay.textContent = quizScore;
                quizAccuracyDisplay.textContent = `${accuracy}%`;

                // Restore crowns display
                const crownsEarned = resultsData.crownsEarned;
                crownsEarnedDisplay.innerHTML = '';
                if (crownsEarned > 0) {
                    crownRewardContainer.style.display = 'block';

                    // Add "Crowns Collected:" label
                    const label = document.createElement('span');
                    label.textContent = 'Crowns Collected: ';
                    label.className = 'crowns-label';
                    crownsEarnedDisplay.appendChild(label);

                    // Create crown container with badge
                    const crownContainer = document.createElement('div');
                    crownContainer.className = 'crown-collected-container';

                    // Add crown image
                    const crownImg = document.createElement('img');
                    crownImg.src = 'avatars/crown.png';
                    crownImg.alt = 'Crown';
                    crownImg.className = 'crown-collected-icon';
                    crownContainer.appendChild(crownImg);

                    // Add badge with count
                    const badge = document.createElement('div');
                    badge.className = 'crown-collected-badge';
                    badge.textContent = crownsEarned;
                    crownContainer.appendChild(badge);

                    crownsEarnedDisplay.appendChild(crownContainer);
                } else {
                    crownRewardContainer.style.display = 'none';
                }

                // Clean up sessionStorage
                sessionStorage.removeItem('pi-results-state');
            }
        }
        // For 'start' source, selectProfile() already shows start screen by default

        // Clean URL (removes parameters from address bar)
        window.history.replaceState({}, document.title, 'index.html');
    } else {
        // Normal initialization - show profile selection
        displayProfiles();
    }

    addProfileBtn.addEventListener('click', openProfileModal);
    createProfileBtn.addEventListener('click', createProfile);
    cancelProfileBtn.addEventListener('click', closeProfileModal);
    changeProfileBtn.addEventListener('click', switchProfile);

    // Mobile button event listeners
    if (changeProfileBtnMobile) {
        changeProfileBtnMobile.addEventListener('click', switchProfile);
    }
    if (viewProgressBtnMobile) {
        viewProgressBtnMobile.addEventListener('click', navigateToProgress);
    }

    // π navigation buttons - navigate back to profile selection
    if (piNavBtn) {
        piNavBtn.addEventListener('click', switchProfile);
    }
    if (piNavBtnQuiz) {
        piNavBtnQuiz.addEventListener('click', switchProfile);
    }

    startBtn.addEventListener('click', startQuiz);
    nextLevelBtn.addEventListener('click', startQuiz);
    playAgainBtn.addEventListener('click', () => {
        // Replay the current level (don't decrement, the level was already incremented in endQuiz)
        currentLevel--;
        startQuiz();
    });
    viewMapBtn.addEventListener('click', openLevelMap);
    viewMapBtnStart.addEventListener('click', openLevelMap);
    closeMapBtn.addEventListener('click', closeLevelMap);

    // Desktop level-up button event listeners (same functionality as mobile)
    if (nextLevelBtnDesktop) nextLevelBtnDesktop.addEventListener('click', startQuiz);
    if (playAgainBtnDesktop) {
        playAgainBtnDesktop.addEventListener('click', () => {
            currentLevel--;
            startQuiz();
        });
    }
    if (viewMapBtnDesktop) viewMapBtnDesktop.addEventListener('click', openLevelMap);
    prevGradeBtn.addEventListener('click', showPreviousGrade);
    nextGradeBtn.addEventListener('click', showNextGrade);
    confirmDeleteBtn.addEventListener('click', confirmDeleteProfile);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    submitBtn.addEventListener('click', submitAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !submitBtn.disabled) {
            submitBtn.click(); // Trigger button click to match exact button behavior
        }
    });
    profileNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createProfile();
        }
    });
    // Pi symbol button (with null check)
    if (piSymbol) {
        piSymbol.addEventListener('click', goToHomePage);
    }

    // Desktop progress button (with null check)
    if (viewProgressBtnDesktop) {
        viewProgressBtnDesktop.addEventListener('click', navigateToProgress);
    }

    // Grade selector is now display-only - users cannot manually change grades
    // Grade advancement happens automatically when all operations (mixed, addition, subtraction, multiplication, division) are completed
    /*
    gradeSelect.addEventListener('change', () => {
        // Reload current level for new grade/operation
        if (currentProfile && profiles[currentProfile]) {
            const profile = profiles[currentProfile];
            const grade = parseInt(gradeSelect.value);
            const gradeKey = `grade${grade}`;

            if (!profile.currentLevels) profile.currentLevels = {};
            if (!profile.currentLevels[gradeKey]) profile.currentLevels[gradeKey] = {};

            currentLevel = profile.currentLevels[gradeKey][selectedOperation] || 1;
            maxLevelAchieved = currentLevel; // Update max level when switching grades
            updateLevelDisplay(currentLevel);

            // Update mobile grade display
            if (currentGradeMobile) {
                currentGradeMobile.textContent = grade;
            }
        }

        updateTimeDisplay();
        updateOperationOptions();
        updateStartScreenUI(); // Update start screen based on level completion
    });
    */

    // Operation pill button click handlers
    const operationPills = document.querySelectorAll('.operation-pill');

    operationPills.forEach((pill) => {
        pill.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Stop event bubbling

            const newOperation = pill.getAttribute('data-operation');

            // Check if pill is disabled
            if (pill.disabled) {
                return;
            }

            selectedOperation = newOperation;

            // Update active state on pills
            operationPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Reload current level for new operation
            if (currentProfile && profiles[currentProfile]) {
                const profile = profiles[currentProfile];
                const grade = parseInt(gradeSelect.value);
                const gradeKey = `grade${grade}`;

                if (!profile.currentLevels) profile.currentLevels = {};
                if (!profile.currentLevels[gradeKey]) profile.currentLevels[gradeKey] = {};

                currentLevel = profile.currentLevels[gradeKey][selectedOperation] || 1;
                maxLevelAchieved = currentLevel; // Update max level when switching operations
                updateLevelDisplay(currentLevel);
                updateTimeDisplay();
                updateStartScreenUI(); // Update start screen based on level completion

                // CRITICAL: Update the profile object with the new operation BEFORE saving
                profile.selectedOperation = selectedOperation;

                // Save the operation change to profile immediately
                saveProfiles();
            }
        });
    });

    // Initialize number pad for mobile devices
    initNumberPad();

    // Handle window resize for device type changes
    window.addEventListener('resize', () => {
        const wasMobile = isNumberPadActive;
        const isMobile = isMobileDevice();

        if (wasMobile !== isMobile) {
            location.reload(); // Reload if device type changes
        }
    });
}

// Helper functions to update both mobile and desktop feedback areas
function updateFeedback(textContent, className) {
    feedbackDiv.textContent = textContent;
    feedbackDiv.className = className;
    feedbackDivDesktop.textContent = textContent;
    feedbackDivDesktop.className = className;
}

function updateFeedbackAnswer(text, display) {
    feedbackAnswerDiv.textContent = text;
    feedbackAnswerDiv.style.display = display;
    feedbackAnswerDivDesktop.textContent = text;
    feedbackAnswerDivDesktop.style.display = display;
}

// Helper function to update level display and mission text
function updateLevelDisplay(level) {
    levelDisplay.textContent = level;
    if (levelMissionText) {
        levelMissionText.textContent = `Level ${level} Mission:`;
    }
}

// Removed updateContinueButton function - using auto-advance instead

// ============================================
// NUMBER PAD FUNCTIONS (MOBILE ONLY)
// ============================================

// Detect if mobile or tablet device (should use number pad to prevent keyboard blocking)
function isMobileDevice() {
    return window.innerWidth <= 900; // Changed from 600 to 900 to include tablets
}

// ============================================
// Portrait Lock Device Detection (for tablets and phones)
// ============================================

/**
 * Robust device type detection for portrait lock
 * Combines user agent, touch points, screen dimensions, and aspect ratio
 * Returns: 'phone', 'tablet', or 'desktop'
 * Accuracy: 95%+ across modern devices (2026)
 */
function detectDeviceType() {
    const ua = navigator.userAgent;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = Math.max(width, height) / Math.min(width, height);
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    // 1. iPad detection (handles iPadOS desktop mode issue)
    // iPadOS Safari reports as "Macintosh" in desktop mode, so we check touch points
    const isIPad = (/iPad/i.test(ua)) ||
                   (/Macintosh/i.test(ua) && maxTouchPoints > 1);

    if (isIPad) {
        return 'tablet';
    }

    // 2. Android tablet detection
    // Android tablets have "Android" but NOT "Mobile" in user agent
    const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
    if (isAndroidTablet) {
        return 'tablet';
    }

    // 3. Phone detection
    const isPhone = /Mobile|iPhone|Android.*Mobile/i.test(ua);
    if (isPhone) {
        return 'phone';
    }

    // 4. Screen-based fallback for edge cases
    const shortSide = Math.min(width, height);

    // Touch-capable device with phone/tablet characteristics
    if (maxTouchPoints > 0) {
        // Phone: short side < 768px and very tall aspect ratio (> 1.6:1)
        if (shortSide < 768 && aspectRatio > 1.6) {
            return 'phone';
        }

        // Tablet: short side 600-1100px and tablet aspect ratio (1.2-1.8:1)
        if (shortSide >= 600 && shortSide <= 1100 && aspectRatio >= 1.2 && aspectRatio <= 1.8) {
            return 'tablet';
        }
    }

    // Desktop fallback
    return 'desktop';
}

/**
 * Apply portrait lock based on device type and orientation
 * Adds/removes 'force-portrait-lock' class on body element
 */
function applyPortraitLock() {
    const deviceType = detectDeviceType();
    const isLandscape = window.innerWidth > window.innerHeight;

    // Apply portrait lock only for phones and tablets in landscape orientation
    if ((deviceType === 'phone' || deviceType === 'tablet') && isLandscape) {
        document.body.classList.add('force-portrait-lock');
    } else {
        document.body.classList.remove('force-portrait-lock');
    }
}

// Initialize portrait lock detection on page load
window.addEventListener('load', applyPortraitLock);

// Re-check on window resize (handles orientation changes on all devices)
window.addEventListener('resize', applyPortraitLock);

// Re-check on orientation change (iOS/Android specific event)
window.addEventListener('orientationchange', applyPortraitLock);

// Append digit to number pad display
function appendDigit(digit) {
    // Prevent leading zeros
    if (numberPadValue === '0' && digit === '0') return;
    if (numberPadValue === '-0' && digit === '0') return;

    // Replace single 0 with new digit
    if (numberPadValue === '0' || numberPadValue === '-0') {
        numberPadValue = numberPadValue.includes('-') ? '-' + digit : digit;
    } else {
        // Limit to 6 digits
        if (numberPadValue.replace('-', '').length >= 6) return;
        numberPadValue += digit;
    }

    updateNumberPadDisplay();
}

// Toggle negative/positive sign
function toggleSign() {
    if (numberPadValue === '' || numberPadValue === '0') {
        numberPadValue = '-';
    } else if (numberPadValue.startsWith('-')) {
        numberPadValue = numberPadValue.substring(1);
    } else {
        numberPadValue = '-' + numberPadValue;
    }

    updateNumberPadDisplay();
}

// Delete last digit
function deleteLastDigit() {
    if (numberPadValue.length === 0) return;

    numberPadValue = numberPadValue.slice(0, -1);

    // If only negative sign remains, clear it
    if (numberPadValue === '-') {
        numberPadValue = '';
    }

    updateNumberPadDisplay();
}

// Clear entire input
function clearNumberPad() {
    numberPadValue = '';
    updateNumberPadDisplay();
}

// Update display
function updateNumberPadDisplay() {
    const display = document.getElementById('number-pad-display');
    if (!display) return;

    if (numberPadValue === '' || numberPadValue === '-') {
        display.textContent = 'Enter answer';
        display.classList.add('empty');
        display.classList.remove('negative');
    } else {
        display.textContent = numberPadValue;
        display.classList.remove('empty');
        display.classList.toggle('negative', numberPadValue.startsWith('-'));
    }

    // Enable/disable submit button
    const submitBtn = document.getElementById('number-pad-submit');
    if (submitBtn) {
        submitBtn.disabled = (numberPadValue === '' || numberPadValue === '-');
    }
}

// Reset number pad for new question
function resetNumberPad() {
    numberPadValue = '';
    updateNumberPadDisplay();
}

// Get current value as integer
function getNumberPadValue() {
    if (numberPadValue === '' || numberPadValue === '-') {
        return NaN;
    }
    return parseInt(numberPadValue, 10);
}

// Initialize number pad event listeners
function initNumberPad() {
    if (!isMobileDevice()) return;

    isNumberPadActive = true;

    const numberButtons = document.querySelectorAll('.number-btn[data-digit]');
    const signButton = document.getElementById('number-pad-sign');
    const backspaceButton = document.getElementById('number-pad-backspace');
    const submitButton = document.getElementById('number-pad-submit');

    // Number buttons (0-9)
    numberButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            appendDigit(btn.dataset.digit);
        });
    });

    // Sign toggle (±)
    if (signButton) {
        signButton.addEventListener('click', toggleSign);
    }

    // Backspace (⌫)
    if (backspaceButton) {
        backspaceButton.addEventListener('click', deleteLastDigit);
    }

    // Submit (Send button)
    if (submitButton) {
        submitButton.addEventListener('click', submitAnswer);
    }
}

// ============================================
// END NUMBER PAD FUNCTIONS
// ============================================

// Navigate to home page (profile selection)
function goToHomePage() {
    // Close delete modal if it's open
    closeDeleteModal();

    // Return to start screen first (resets all UI states)
    showStartScreen();

    // Then hide game container and show profile selection
    gameContainer.classList.add('hidden');
    profileSelection.classList.remove('hidden');

    // Refresh profile list to show updated data
    displayProfiles();
}

// Grade-specific math curriculum aligned with CBSE syllabus
const gradeCurriculum = {
    1: { // Grade 1 (CBSE): Numbers 1-20, basic addition and subtraction
        operations: ['addition', 'subtraction'],
        numberRange: { min: 1, max: 20 },
        allowNegative: false,
        description: 'Basic addition and subtraction with numbers 1-20'
    },
    2: { // Grade 2 (CBSE): Numbers up to 99, addition and subtraction
        operations: ['addition', 'subtraction'],
        numberRange: { min: 1, max: 99 },
        allowNegative: false,
        description: 'Two-digit addition and subtraction'
    },
    3: { // Grade 3 (CBSE): Multiplication tables 2,3,4,5,10; two-digit multiplication
        operations: ['addition', 'subtraction', 'multiplication'],
        numberRange: { min: 1, max: 100 },
        multiplicationRange: { min: 2, max: 10 },
        allowNegative: false,
        description: 'Multiplication tables and two-digit operations'
    },
    4: { // Grade 4 (CBSE): All four operations, tables up to 12, formal division
        operations: ['addition', 'subtraction', 'multiplication', 'division'],
        numberRange: { min: 1, max: 144 },
        multiplicationRange: { min: 2, max: 12 },
        allowNegative: false,
        description: 'Four operations with multiplication tables up to 12'
    },
    5: { // Grade 5 (CBSE): Four operations with larger numbers, decimals introduction
        operations: ['addition', 'subtraction', 'multiplication', 'division'],
        numberRange: { min: 1, max: 500 },
        multiplicationRange: { min: 2, max: 15 },
        allowNegative: false,
        description: 'Four operations with larger numbers'
    },
    6: { // Grade 6 (CBSE): Integers (negative numbers), fractions, decimals
        operations: ['addition', 'subtraction', 'multiplication', 'division'],
        numberRange: { min: -100, max: 1000 },
        multiplicationRange: { min: -12, max: 20 },
        allowNegative: true,
        description: 'Operations with integers and negative numbers'
    },
    7: { // Grade 7 (CBSE): Operations with fractions, rational numbers
        operations: ['addition', 'subtraction', 'multiplication', 'division'],
        numberRange: { min: -200, max: 2000 },
        multiplicationRange: { min: -15, max: 25 },
        allowNegative: true,
        description: 'Advanced operations with rational numbers'
    },
    8: { // Grade 8 (CBSE): Advanced integer operations, exponents
        operations: ['addition', 'subtraction', 'multiplication', 'division'],
        numberRange: { min: -500, max: 5000 },
        multiplicationRange: { min: -20, max: 30 },
        allowNegative: true,
        description: 'Complex arithmetic with integers'
    },
    9: { // Grade 9 (CBSE): Real numbers, polynomials
        operations: ['addition', 'subtraction', 'multiplication', 'division'],
        numberRange: { min: -1000, max: 10000 },
        multiplicationRange: { min: -25, max: 40 },
        allowNegative: true,
        description: 'Real numbers and polynomial operations'
    },
    10: { // Grade 10 (CBSE): Advanced arithmetic, real numbers
        operations: ['addition', 'subtraction', 'multiplication', 'division'],
        numberRange: { min: -2000, max: 20000 },
        multiplicationRange: { min: -30, max: 50 },
        allowNegative: true,
        description: 'Advanced real number operations'
    }
};

// Operation mapping for file suffixes
const operationSuffixes = {
    'mixed': 'x',
    'addition': 'a',
    'subtraction': 's',
    'multiplication': 'm',
    'division': 'd'
};

// Operation colors for SVG path overlay
const operationColors = {
    'mixed': { color: '#9B59B6', name: 'Mixed Challenge', glow: 'rgba(155, 89, 182, 0.4)' },
    'addition': { color: '#4A90E2', name: 'Addition Path', glow: 'rgba(74, 144, 226, 0.4)' },
    'subtraction': { color: '#E74C3C', name: 'Subtraction Trail', glow: 'rgba(231, 76, 60, 0.4)' },
    'multiplication': { color: '#27AE60', name: 'Multiplication Route', glow: 'rgba(39, 174, 96, 0.4)' },
    'division': { color: '#F39C12', name: 'Division Journey', glow: 'rgba(243, 156, 18, 0.4)' }
};

// Update operation selector based on selected grade
function updateOperationOptions(preferredOperation = null) {
    const grade = parseInt(gradeSelect.value);
    const curriculum = gradeCurriculum[grade];
    const availableOperations = curriculum.operations;

    // Get current selection (use preferred if provided, otherwise use current selectedOperation)
    const currentSelection = preferredOperation || selectedOperation;

    // Get all operation pill buttons
    const operationPills = document.querySelectorAll('.operation-pill');

    // Enable/disable pills based on grade curriculum
    operationPills.forEach(pill => {
        const operation = pill.getAttribute('data-operation');

        // Mixed is always available, others depend on grade curriculum
        if (operation === 'mixed' || availableOperations.includes(operation)) {
            pill.disabled = false;
            pill.style.opacity = '1';
            pill.style.cursor = 'pointer';
        } else {
            pill.disabled = true;
            pill.style.opacity = '0.4';
            pill.style.cursor = 'not-allowed';
            // Remove active state if disabled
            pill.classList.remove('active');
        }
    });

    // Restore previous selection if it's still available, otherwise default to mixed
    if (currentSelection === 'mixed' || availableOperations.includes(currentSelection)) {
        selectedOperation = currentSelection;
        // Set active class on the selected pill
        operationPills.forEach(pill => {
            if (pill.getAttribute('data-operation') === selectedOperation) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    } else {
        selectedOperation = 'mixed';
        // Set active class on mixed pill
        operationPills.forEach(pill => {
            if (pill.getAttribute('data-operation') === 'mixed') {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }
}

// Get operation suffix for map file naming
function getOperationSuffix(operation) {
    return operationSuffixes[operation] || 'x';
}

// Profile Management
function loadProfiles() {
    const saved = localStorage.getItem('mathMasterProfiles');
    if (saved) {
        profiles = JSON.parse(saved);
        migrateOldProfiles(); // Fix old profiles that have currentLevel = 10 for completed operations
    }
}

/**
 * Migration function to fix old profiles where users completed all 10 levels
 * before the currentLevel = 11 fix was implemented.
 *
 * This function checks if a profile has completed all 10 levels of an operation
 * (by checking levelCompletion data) and updates currentLevel to 11 if needed.
 */
function migrateOldProfiles() {
    const maxLevel = 10;
    let migrationApplied = false;

    Object.keys(profiles).forEach(profileId => {
        const profile = profiles[profileId];

        // Migration 1: Add default grade if missing
        if (!profile.grade) {
            profile.grade = 3; // Default to Grade 3
            migrationApplied = true;
        }

        // Check if profile has level completion data
        if (!profile.levelCompletion) return;
        if (!profile.currentLevels) return;

        // Check each grade
        Object.keys(profile.levelCompletion).forEach(gradeKey => {
            const gradeData = profile.levelCompletion[gradeKey];

            // Check each operation within the grade
            Object.keys(gradeData).forEach(operation => {
                const operationLevels = gradeData[operation];

                // Check if level 10 is completed (has crown data)
                if (operationLevels[maxLevel] && operationLevels[maxLevel].crowns > 0) {
                    // Level 10 is completed, check if currentLevel needs updating
                    if (!profile.currentLevels[gradeKey]) {
                        profile.currentLevels[gradeKey] = {};
                    }

                    const currentLevelForOperation = profile.currentLevels[gradeKey][operation];

                    // If currentLevel is 10 (not 11), update it to 11
                    if (currentLevelForOperation === maxLevel) {
                        profile.currentLevels[gradeKey][operation] = maxLevel + 1;
                        migrationApplied = true;
                    }
                }
            });
        });
    });

    // Save profiles if any migration was applied
    if (migrationApplied) {
        saveProfiles();
    }
}

function saveProfiles() {
    localStorage.setItem('mathMasterProfiles', JSON.stringify(profiles));
}

function displayProfiles() {
    profileList.innerHTML = '';

    Object.keys(profiles).forEach(profileId => {
        const profile = profiles[profileId];
        const avatarGender = profile.avatarGender || 'boy';

        // Calculate overall performance emotion for profile card
        const totalAttempted = profile.totalAttempted || 0;
        const totalCorrect = profile.totalCorrect || 0;
        const accuracy = totalAttempted > 0 ? totalCorrect / totalAttempted : 0;

        // Determine emotion based on overall accuracy
        let profileEmotion = 'neutral';
        if (totalAttempted >= 10) { // Only show emotion if they've attempted at least 10 questions
            if (accuracy >= 0.8) {
                profileEmotion = 'excited';
            } else if (accuracy >= 0.7) {
                profileEmotion = 'happy';
            } else if (accuracy >= 0.5) {
                profileEmotion = 'neutral';
            } else if (accuracy >= 0.3) {
                profileEmotion = 'shocked';
            } else {
                profileEmotion = 'sad';
            }
        }

        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <button class="delete-profile" data-profile-id="${profileId}">×</button>
            <div class="profile-crowns">
                <img src="avatars/crown.png" alt="Crown" class="crown-icon">
                <span>${profile.crowns || 0}</span>
            </div>
            <div class="profile-avatar">
                <img src="avatars/${avatarGender}-${profileEmotion}.png" alt="${profile.name}" class="profile-avatar-img">
            </div>
            <div class="profile-info">
                <div class="profile-name">${profile.name}</div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-profile')) {
                selectProfile(profileId);
            }
        });

        const deleteBtn = card.querySelector('.delete-profile');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteProfile(profileId);
        });

        profileList.appendChild(card);
    });

    // Update add profile button state based on profile count
    updateAddProfileButton();
}

// Maximum number of profiles allowed
const MAX_PROFILES = 4;

// Update the Add Profile button based on current profile count
function updateAddProfileButton() {
    const addProfileBtn = document.getElementById('add-profile-btn');
    const profileCount = Object.keys(profiles).length;

    if (profileCount >= MAX_PROFILES) {
        addProfileBtn.disabled = true;
        addProfileBtn.textContent = `Maximum ${MAX_PROFILES} Profiles Reached`;
        addProfileBtn.style.opacity = '0.5';
        addProfileBtn.style.cursor = 'not-allowed';
    } else {
        addProfileBtn.disabled = false;
        addProfileBtn.textContent = '+ Add New Profile';
        addProfileBtn.style.opacity = '1';
        addProfileBtn.style.cursor = 'pointer';
    }
}

function openProfileModal() {
    // Check profile limit before opening modal
    const profileCount = Object.keys(profiles).length;
    if (profileCount >= MAX_PROFILES) {
        alert(`You can only create a maximum of ${MAX_PROFILES} profiles.`);
        return;
    }

    profileModal.classList.remove('hidden');
    profileNameInput.value = '';
    profileNameInput.focus();
}

function closeProfileModal() {
    profileModal.classList.add('hidden');
}

function createProfile() {
    const name = profileNameInput.value.trim();

    if (!name) {
        alert('Please enter a name!');
        return;
    }

    const profileId = Date.now().toString();
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    // Get selected avatar gender
    const selectedGender = document.querySelector('input[name="avatar-gender"]:checked').value;

    // Get selected grade level
    const selectedGrade = parseInt(document.getElementById('profile-grade-select').value);

    profiles[profileId] = {
        id: profileId,
        name: name,
        avatar: avatar,
        avatarGender: selectedGender, // Store avatar gender
        grade: selectedGrade, // Store selected grade
        crowns: 0,
        currentLevel: 1,
        totalScore: 0,
        totalAttempted: 0,
        totalCorrect: 0,
        bestStreak: 0,
        createdAt: new Date().toISOString()
    };

    saveProfiles();
    closeProfileModal();
    displayProfiles();
}

function deleteProfile(profileId) {
    // Store the profile to delete
    profileToDelete = profileId;
    const profile = profiles[profileId];

    // Set the avatar image based on gender
    const sadAvatar = profile.avatarGender === 'girl' ? 'avatars/girl-sad.png' : 'avatars/boy-sad.png';
    deleteAvatarImage.src = sadAvatar;

    // Update the heading with profile name
    deleteProfileName.textContent = `Delete ${profile.name}?`;

    // Show the modal
    deleteConfirmModal.classList.remove('hidden');
}

function confirmDeleteProfile() {
    if (profileToDelete) {
        delete profiles[profileToDelete];
        saveProfiles();
        displayProfiles();

        if (currentProfile === profileToDelete) {
            currentProfile = null;
            profileSelection.classList.remove('hidden');
            gameContainer.classList.add('hidden');
        }

        profileToDelete = null;
    }
    closeDeleteModal();
}

function closeDeleteModal() {
    deleteConfirmModal.classList.add('hidden');
    profileToDelete = null;
}

function selectProfile(profileId) {
    currentProfile = profileId;
    const profile = profiles[profileId];

    // Set grade selector to profile's stored grade
    if (profile.grade) {
        gradeSelect.value = profile.grade.toString();
    }

    // Load profile data
    const grade = parseInt(gradeSelect.value);
    const gradeKey = `grade${grade}`;

    // Load selected operation (default to 'mixed' if not saved)
    selectedOperation = profile.selectedOperation || 'mixed';

    // Load current level for this grade and operation
    if (!profile.currentLevels) profile.currentLevels = {};
    if (!profile.currentLevels[gradeKey]) profile.currentLevels[gradeKey] = {};

    currentLevel = profile.currentLevels[gradeKey][selectedOperation] || 1;
    maxLevelAchieved = currentLevel; // Initialize max level to current level
    totalScore = profile.totalScore || 0;
    totalAttempted = profile.totalAttempted || 0;
    totalCorrect = profile.totalCorrect || 0;
    bestStreak = profile.bestStreak || 0;
    totalCrowns = profile.crowns || 0;
    avatarGender = profile.avatarGender || 'boy'; // Load avatar gender

    // Update displays
    currentPlayerName.textContent = profile.name;
    totalCrownsDisplay.textContent = totalCrowns;
    updateLevelDisplay(currentLevel);
    scoreDisplay.textContent = totalScore;

    // Update desktop player info elements
    if (currentGradeDesktop) {
        currentGradeDesktop.textContent = profile.grade;
    }

    // Update mobile player info elements (if they exist)
    if (currentPlayerNameMobile) {
        currentPlayerNameMobile.textContent = profile.name.toUpperCase();
    }
    if (currentGradeMobile) {
        currentGradeMobile.textContent = profile.grade;
    }
    if (totalCrownsMobile) {
        totalCrownsMobile.textContent = totalCrowns;
    }

    updateStats();
    updateTimeDisplay();
    updateOperationOptions(selectedOperation);
    updateStartScreenUI(); // Update start screen based on level completion

    // Initialize AI agent
    if (window.PiAIAgent) {
        aiAgent = new window.PiAIAgent();
        aiAgent.initialize(profile);
    }

    // Show game container
    profileSelection.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    // Check current screen state to preserve it
    const isQuizScreenVisible = !quizScreen.classList.contains('hidden');
    const isResultsScreenVisible = !resultsScreen.classList.contains('hidden');
    const isLevelUpVisible = !levelUpSection.classList.contains('hidden') ||
                             (levelUpSectionDesktop && !levelUpSectionDesktop.classList.contains('hidden'));

    // Preserve quiz state if user is mid-quiz (keep quiz running)
    if (isQuizScreenVisible) {
        // User is mid-quiz - preserve quiz screen state
        const playerInfoRow = document.querySelector('.player-info-row');
        if (playerInfoRow) playerInfoRow.style.display = 'none'; // Keep hidden during quiz
        if (scoreBoardRow) scoreBoardRow.style.display = 'flex'; // Keep score board visible
        // Quiz continues running with existing timer and state
    }
    // Preserve results/level-up state
    else if (isResultsScreenVisible || isLevelUpVisible) {
        // User is viewing results/level-up - preserve that screen state
        const playerInfoRow = document.querySelector('.player-info-row');
        if (playerInfoRow) playerInfoRow.style.display = 'flex';
        if (scoreBoardRow) scoreBoardRow.style.display = 'none';
    }
    // Default: show start screen (user was on start screen or switching profiles)
    else {
        showStartScreen();
    }
}

function showProgressSummary() {
    const profile = profiles[currentProfile];
    if (!profile) return;

    const totalCrowns = profile.totalCrowns || 0;
    const totalScore = profile.totalScore || 0;
    const currentLvl = profile.level || 1;

    const message = `${profile.name}'s Progress:\n\n` +
                    `Level: ${currentLvl}\n` +
                    `Total Crowns: ${totalCrowns}\n` +
                    `Total Score: ${totalScore}\n\n` +
                    `Keep practicing to earn more crowns and level up!`;

    alert(message);
}

function navigateToProgress() {
    if (!currentProfile) return;

    // ALWAYS save profile data first to ensure all progress is persisted
    // This is critical - without this, navigating from start screen loses data
    saveProfileData();

    // Determine current screen for context-aware return navigation
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');

    let source = 'start'; // default
    if (quizScreen && !quizScreen.classList.contains('hidden')) {
        source = 'quiz';

        // Save current quiz state to sessionStorage
        sessionStorage.setItem('pi-quiz-state', JSON.stringify({
            currentQuestion: currentQuestion,
            quizCorrect: quizCorrect,
            quizScore: quizScore,
            quizAttempted: quizAttempted,
            currentStreak: currentStreak,
            timeRemaining: timeRemaining
        }));
    } else if (resultsScreen && !resultsScreen.classList.contains('hidden')) {
        source = 'results';

        // Save results screen state to sessionStorage
        const crownsEarnedElement = document.querySelector('.crown-collected-badge');
        const crownsEarned = crownsEarnedElement ? parseInt(crownsEarnedElement.textContent) : 0;

        sessionStorage.setItem('pi-results-state', JSON.stringify({
            quizCorrect: quizCorrect,
            quizScore: quizScore,
            crownsEarned: crownsEarned,
            currentLevel: currentLevel,
            maxLevelAchieved: maxLevelAchieved
        }));
    }

    // Save AI agent data before navigating
    if (aiAgent) {
        const aiData = aiAgent.saveToProfile();
        profiles[currentProfile] = {
            ...profiles[currentProfile],
            ...aiData
        };
        saveProfiles();
    }

    window.location.href = `progress.html?profile=${currentProfile}&source=${source}`;
}

function switchProfile() {
    saveProfileData();

    // Clean up any running timers/animations to prevent memory leaks
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (emotionAnimationInterval) {
        clearInterval(emotionAnimationInterval);
        emotionAnimationInterval = null;
    }

    currentProfile = null;

    // Close delete modal if it's open
    closeDeleteModal();

    profileSelection.classList.remove('hidden');
    gameContainer.classList.add('hidden');
    // Hide score-board when returning to profile selection
    if (scoreBoardRow) scoreBoardRow.style.display = 'none';

    // Re-display profile cards (critical - without this, cards are missing)
    displayProfiles();
}

function saveProfileData() {
    if (currentProfile && profiles[currentProfile]) {
        const profile = profiles[currentProfile];
        const grade = parseInt(gradeSelect.value);
        const gradeKey = `grade${grade}`;

        // Initialize currentLevels structure if needed
        if (!profile.currentLevels) profile.currentLevels = {};
        if (!profile.currentLevels[gradeKey]) profile.currentLevels[gradeKey] = {};

        // Save max level achieved for this grade and operation (not current level which might be a replay)
        // This ensures we always save the highest level reached
        profile.currentLevels[gradeKey][selectedOperation] = Math.max(
            currentLevel,
            profile.currentLevels[gradeKey][selectedOperation] || 1
        );

        // Save other profile data
        profile.selectedOperation = selectedOperation; // Save selected operation
        profile.totalScore = totalScore;
        profile.totalAttempted = totalAttempted;
        profile.totalCorrect = totalCorrect;
        profile.bestStreak = bestStreak;
        profile.crowns = totalCrowns;

        // Save AI agent data
        if (aiAgent) {
            const aiData = aiAgent.saveToProfile();
            Object.assign(profile, aiData);
        }

        saveProfiles();
    }
}

// Update time display based on current level and grade
function updateTimeDisplay() {
    const grade = parseInt(gradeSelect.value);

    // Grade-specific time configurations based on educational research
    // Research shows: minimum 8-20s depending on age, gradual 1-2s decay per level
    const gradeConfig = {
        1:  { start: 40, min: 20, decay: 2.0 },   // Ages 6-7: Basic addition/subtraction
        2:  { start: 40, min: 20, decay: 2.0 },   // Ages 7-8: Building fluency
        3:  { start: 30, min: 15, decay: 1.5 },   // Ages 8-9: Multiplication intro
        4:  { start: 30, min: 15, decay: 1.5 },   // Ages 9-10: Multi-digit operations
        5:  { start: 25, min: 12, decay: 1.3 },   // Ages 10-11: Larger numbers
        6:  { start: 25, min: 12, decay: 1.3 },   // Ages 11-12: Complex calculations
        7:  { start: 20, min: 10, decay: 1.0 },   // Ages 12-13: Negative numbers
        8:  { start: 20, min: 10, decay: 1.0 },   // Ages 13-14: Advanced operations
        9:  { start: 20, min: 8,  decay: 1.2 },   // Ages 14-15: High school math
        10: { start: 20, min: 8,  decay: 1.2 }    // Ages 15-16: Advanced arithmetic
    };

    const config = gradeConfig[grade] || { start: 30, min: 15, decay: 1.5 };
    const calculatedTime = config.start - (currentLevel - 1) * config.decay;
    timePerQuestion = Math.max(config.min, calculatedTime);

    startTimeDisplay.textContent = timePerQuestion;
}

// Update start screen UI based on level completion status
function updateStartScreenUI() {
    const maxLevel = 10;
    const levelMissionElement = document.querySelector('.level-mission-text');
    const missionInfoElement = document.querySelector('.mission-info');
    const goBtnWrapper = document.querySelector('.go-btn-wrapper');

    if (currentLevel > maxLevel) {
        // All levels completed for this operation (currentLevel is 11 after completing level 10)
        if (levelMissionElement) {
            levelMissionElement.textContent = 'All Missions Conquered!';
        }
        // Hide mission details
        if (missionInfoElement) {
            missionInfoElement.style.display = 'none';
        }
        // Hide GO button and wrapper
        if (goBtnWrapper) {
            goBtnWrapper.style.display = 'none';
        }
    } else {
        // Still have levels to complete - show normal mission text with level number
        if (levelMissionElement) {
            levelMissionElement.textContent = `Level ${currentLevel} Mission:`;
        }
        // Show mission details
        if (missionInfoElement) {
            missionInfoElement.style.display = 'block';
        }
        // Show GO button and wrapper
        if (goBtnWrapper) {
            goBtnWrapper.style.display = 'flex';
        }
    }
}

/**
 * Show the start screen with all appropriate UI elements
 */
function showStartScreen() {
    // Show start screen, hide others
    startScreen.classList.remove('hidden');
    quizScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');

    // Show player-info-row (π + player info panel) on start screen
    const playerInfoRow = document.querySelector('.player-info-row');
    if (playerInfoRow) playerInfoRow.style.display = 'flex';

    // Show explore map button on start screen
    if (viewMapBtnStart) viewMapBtnStart.classList.remove('hidden');

    // Show stats section and hide avatar section on start screen
    const avatarSection = document.getElementById('avatar-section');
    const statsSection = document.getElementById('stats-section');
    if (avatarSection) avatarSection.classList.add('hidden');
    if (statsSection) statsSection.classList.remove('hidden');
    if (levelUpSection) levelUpSection.classList.add('hidden');

    // Re-enable grade selector
    gradeSelect.disabled = false;

    // Update start screen UI based on level completion
    updateStartScreenUI();
}

// Start a new quiz
function startQuiz() {
    // Reset quiz state
    currentQuestion = 0;
    quizQuestions = [];
    quizCorrect = 0;
    quizScore = 0;

    // Update time per question based on level
    updateTimeDisplay();

    // Generate 10 questions
    for (let i = 0; i < 10; i++) {
        quizQuestions.push(generateProblem());
    }

    // Update displays
    updateLevelDisplay(currentLevel);
    questionCounterDisplay.textContent = '0/10';
    scoreDisplay.textContent = totalScore;

    // Show quiz screen and hide other screens
    startScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    // Show score-board during quiz
    if (scoreBoardRow) scoreBoardRow.style.display = 'flex';
    // Hide explore map button during quiz
    if (viewMapBtnStart) viewMapBtnStart.classList.add('hidden');

    // Hide player-info-row (π + player info panel) during quiz for better focus and space
    const playerInfoRow = document.querySelector('.player-info-row');
    if (playerInfoRow) playerInfoRow.style.display = 'none';

    // Hide level-up sections (both mobile and desktop) when starting quiz
    if (levelUpSection) levelUpSection.classList.add('hidden');
    if (levelUpSectionDesktop) levelUpSectionDesktop.classList.add('hidden');

    // Show avatar section and hide stats section during quiz
    const avatarSection = document.getElementById('avatar-section');
    const statsSection = document.getElementById('stats-section');
    if (avatarSection) avatarSection.classList.remove('hidden');
    if (statsSection) statsSection.classList.add('hidden');

    // Reset avatar to neutral expression on both layers
    avatarImageBase.src = `avatars/${avatarGender}-neutral.png`;
    avatarImageBase.classList.remove('bounce');
    avatarImageOverlay.src = `avatars/${avatarGender}-neutral.png`;
    avatarImageOverlay.classList.remove('bounce', 'show');
    avatarCorrectDisplay.textContent = '0';
    currentEmotion = 'neutral'; // Reset emotion state

    // Initialize mobile avatar (if exists)
    if (mobileAvatarImage) {
        mobileAvatarImage.src = `avatars/${avatarGender}-neutral.png`;
    }
    if (mobileAvatarCorrect) {
        mobileAvatarCorrect.textContent = '0';
    }

    // Update submit button image based on gender
    const sendImage = avatarGender === 'girl' ? 'avatars/send-1.png' : 'avatars/send.png';
    submitBtn.style.backgroundImage = `url('${sendImage}')`;

    // Disable settings during quiz
    gradeSelect.disabled = true;

    // Show first question
    showNextQuestion();
}

// Generate a random number based on grade level and context
function getRandomNumber(grade, context = 'general') {
    const curriculum = gradeCurriculum[grade];

    if (context === 'multiplication') {
        const range = curriculum.multiplicationRange || curriculum.numberRange;
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    const range = curriculum.numberRange;
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

// ============================================================================
// ADAPTIVE PROBLEM GENERATION WITH AI PATTERN TARGETING
// ============================================================================

/**
 * Generate a math problem based on grade level, selected operation, and AI recommendations
 * This function integrates with the AI agent to provide targeted practice for weak areas
 */
function generateProblem() {
    const grade = parseInt(gradeSelect.value);
    const curriculum = gradeCurriculum[grade];

    // Get AI recommendations if available (requires 10+ problems for statistical significance)
    let aiSuggestion = null;
    let targetPattern = null;
    let difficulty = 'medium'; // Default difficulty

    if (aiAgent && aiAgent.performanceData.sessionHistory.length >= 10) {
        try {
            aiSuggestion = aiAgent.getAdaptiveProblemSuggestion(grade, selectedOperation);
            difficulty = aiSuggestion.difficulty;

            // If AI suggests focusing on specific patterns, pick one to target (60% of the time)
            if (aiSuggestion.focusPatterns && aiSuggestion.focusPatterns.length > 0 && Math.random() < 0.6) {
                targetPattern = aiSuggestion.focusPatterns[0];
            }
        } catch (error) {
            // Fall back to random generation
        }
    }

    // Determine which operation to use
    let operationType;
    if (selectedOperation === 'mixed') {
        // Use AI-recommended operation if available, otherwise random
        if (aiSuggestion && aiSuggestion.operation !== 'mixed') {
            operationType = aiSuggestion.operation;
        } else {
            const operations = curriculum.operations;
            operationType = operations[Math.floor(Math.random() * operations.length)];
        }
    } else {
        operationType = selectedOperation;
    }

    // Generate problem with pattern targeting if specified
    if (targetPattern) {
        try {
            const patternProblem = generatePatternTargetedProblem(grade, operationType, targetPattern, difficulty);
            if (patternProblem) {
                return patternProblem;
            }
        } catch (error) {
            // Fall back to standard generation
        }
    }

    // Fall back to standard problem generation with difficulty adjustment
    return generateStandardProblem(grade, operationType, difficulty, curriculum);
}

/**
 * Determine if vertical format should be used based on grade and operation
 * Vertical format is used for Grades 1-3 addition/subtraction to teach place value
 */
function shouldUseVerticalFormat(grade, operation) {
    // Use vertical format for addition/subtraction in Grades 1-3
    // This aligns with CBSE pedagogy for teaching carrying and borrowing
    return grade <= 3 && (operation === 'addition' || operation === 'subtraction');
}

/**
 * Format a problem in vertical columnar format for place value visualization
 * Example:    47
 *           + 28
 *           ────
 *             ?
 */
function formatVerticalProblem(num1, num2, operator, result) {
    // Return a special marker that will be parsed by the display function
    return `VERTICAL:${num1}:${num2}:${operator}:${result}`;
}

/**
 * Generate a standard problem with difficulty adjustment
 */
function generateStandardProblem(grade, operationType, difficulty, curriculum) {
    let num1, num2, answer, problemText;

    // Determine if vertical format should be used (Grades 1-3 for addition/subtraction)
    const useVerticalFormat = shouldUseVerticalFormat(grade, operationType);

    switch(operationType) {
        case 'addition':
            num1 = getRandomNumberWithDifficulty(grade, difficulty);
            num2 = getRandomNumberWithDifficulty(grade, difficulty);
            answer = num1 + num2;
            problemText = useVerticalFormat ?
                formatVerticalProblem(num1, num2, '+', '?') :
                `${num1} + ${num2} = ?`;
            break;

        case 'subtraction':
            num1 = getRandomNumberWithDifficulty(grade, difficulty);
            num2 = getRandomNumberWithDifficulty(grade, difficulty);

            // For lower grades, ensure positive results
            if (!curriculum.allowNegative && num2 > num1) {
                [num1, num2] = [num2, num1];
            }

            answer = num1 - num2;
            problemText = useVerticalFormat ?
                formatVerticalProblem(num1, num2, '−', '?') :
                `${num1} - ${num2} = ?`;
            break;

        case 'multiplication':
            num1 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            num2 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');

            // Keep numbers reasonable for multiplication
            if (Math.abs(num1) > 50) num1 = Math.floor(num1 / 10);
            if (Math.abs(num2) > 50) num2 = Math.floor(num2 / 10);

            answer = num1 * num2;
            problemText = `${num1} × ${num2} = ?`;
            break;

        case 'division':
            // Generate division that results in whole numbers
            num2 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            // Avoid division by zero
            if (num2 === 0) num2 = Math.random() > 0.5 ? 1 : -1;

            answer = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            num1 = answer * num2;

            problemText = `${num1} ÷ ${num2} = ?`;
            break;
    }

    return {
        num1,
        num2,
        operation: operationType,
        answer,
        problemText,
        isVertical: useVerticalFormat
    };
}

/**
 * Get a random number adjusted for difficulty level
 * - Easy: Lower 40% of range
 * - Medium: Full range
 * - Hard: Upper 40% of range or next grade's lower range
 */
function getRandomNumberWithDifficulty(grade, difficulty, context = 'general') {
    const curriculum = gradeCurriculum[grade];
    let range;

    if (context === 'multiplication') {
        range = curriculum.multiplicationRange || curriculum.numberRange;
    } else {
        range = curriculum.numberRange;
    }

    const rangeSize = range.max - range.min + 1;

    switch(difficulty) {
        case 'easy':
            // Use lower 40% of range
            const easyMax = Math.floor(range.min + rangeSize * 0.4);
            return Math.floor(Math.random() * (easyMax - range.min + 1)) + range.min;

        case 'hard':
            // Use upper 40% of range
            const hardMin = Math.floor(range.max - rangeSize * 0.4);
            return Math.floor(Math.random() * (range.max - hardMin + 1)) + hardMin;

        case 'medium':
        default:
            // Use full range
            return Math.floor(Math.random() * rangeSize) + range.min;
    }
}

// ============================================================================
// PATTERN-SPECIFIC PROBLEM GENERATORS (16 PATTERNS)
// ============================================================================

/**
 * Generate a problem targeting a specific pattern identified by the AI
 */
function generatePatternTargetedProblem(grade, operation, pattern, difficulty) {
    const curriculum = gradeCurriculum[grade];

    switch(operation) {
        case 'addition':
            return generateAdditionPattern(grade, pattern, difficulty, curriculum);
        case 'subtraction':
            return generateSubtractionPattern(grade, pattern, difficulty, curriculum);
        case 'multiplication':
            return generateMultiplicationPattern(grade, pattern, difficulty, curriculum);
        case 'division':
            return generateDivisionPattern(grade, pattern, difficulty, curriculum);
        default:
            return null;
    }
}

// ADDITION PATTERNS
function generateAdditionPattern(grade, pattern, difficulty, curriculum) {
    let num1, num2, answer;
    const range = curriculum.numberRange;
    const useVerticalFormat = shouldUseVerticalFormat(grade, 'addition');

    switch(pattern) {
        case 'large_sums':
            // Generate addition with sums ≥ 100
            num1 = getRandomNumberWithDifficulty(grade, difficulty);
            // Ensure sum is at least 100
            const minNum2 = Math.max(range.min, 100 - num1 + 1);
            num2 = Math.floor(Math.random() * (range.max - minNum2 + 1)) + minNum2;
            answer = num1 + num2;
            break;

        case 'carrying':
            // Generate addition requiring carrying (ones digits sum to ≥10)
            num1 = getRandomNumberWithDifficulty(grade, difficulty);
            const ones1 = num1 % 10;
            // Ensure ones digits sum to at least 10
            const minOnes2 = 10 - ones1;
            const tensPlace = Math.floor(Math.random() * Math.floor((range.max - minOnes2) / 10)) * 10;
            num2 = tensPlace + (minOnes2 + Math.floor(Math.random() * (10 - minOnes2)));
            answer = num1 + num2;
            break;

        case 'single_digit':
            // Single-digit addition (both numbers < 10)
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
            answer = num1 + num2;
            break;

        case 'basic_addition':
        default:
            // Basic two-digit addition
            num1 = getRandomNumberWithDifficulty(grade, difficulty);
            num2 = getRandomNumberWithDifficulty(grade, difficulty);
            answer = num1 + num2;
            break;
    }

    return {
        num1,
        num2,
        operation: 'addition',
        answer,
        problemText: useVerticalFormat ? formatVerticalProblem(num1, num2, '+', '?') : `${num1} + ${num2} = ?`,
        isVertical: useVerticalFormat
    };
}

// SUBTRACTION PATTERNS
function generateSubtractionPattern(grade, pattern, difficulty, curriculum) {
    let num1, num2, answer;
    const useVerticalFormat = shouldUseVerticalFormat(grade, 'subtraction');

    switch(pattern) {
        case 'negative_result':
            // Generate subtraction with negative results (only for grades that allow it)
            if (curriculum.allowNegative) {
                num2 = getRandomNumberWithDifficulty(grade, difficulty);
                num1 = Math.floor(Math.random() * num2); // Ensure num1 < num2
                answer = num1 - num2;
            } else {
                // Fallback to basic subtraction
                num1 = getRandomNumberWithDifficulty(grade, difficulty);
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
            }
            break;

        case 'large_numbers':
            // Subtraction with large numbers (≥100)
            num1 = Math.max(100, getRandomNumberWithDifficulty(grade, difficulty));
            num2 = Math.floor(Math.random() * num1);
            answer = num1 - num2;
            break;

        case 'borrowing':
            // Subtraction requiring borrowing (ones digit of num1 < ones digit of num2)
            num1 = getRandomNumberWithDifficulty(grade, difficulty);
            const ones1 = num1 % 10;
            // Ensure borrowing is needed
            const minOnes2 = ones1 + 1;
            if (minOnes2 <= 9) {
                const tensPlace = Math.floor(Math.random() * Math.floor(num1 / 10)) * 10;
                num2 = tensPlace + (minOnes2 + Math.floor(Math.random() * (10 - minOnes2)));
                num2 = Math.min(num2, num1 - 1); // Ensure positive result for lower grades
            } else {
                num2 = Math.floor(Math.random() * num1);
            }
            answer = num1 - num2;
            break;

        case 'subtract_small':
            // Subtracting single digits
            num1 = getRandomNumberWithDifficulty(grade, difficulty);
            num2 = Math.floor(Math.random() * 9) + 1;
            if (!curriculum.allowNegative && num2 > num1) {
                [num1, num2] = [num2, num1];
            }
            answer = num1 - num2;
            break;

        case 'basic_subtraction':
        default:
            // Basic two-digit subtraction
            num1 = getRandomNumberWithDifficulty(grade, difficulty);
            num2 = getRandomNumberWithDifficulty(grade, difficulty);
            if (!curriculum.allowNegative && num2 > num1) {
                [num1, num2] = [num2, num1];
            }
            answer = num1 - num2;
            break;
    }

    return {
        num1,
        num2,
        operation: 'subtraction',
        answer,
        problemText: useVerticalFormat ? formatVerticalProblem(num1, num2, '−', '?') : `${num1} - ${num2} = ?`,
        isVertical: useVerticalFormat
    };
}

// MULTIPLICATION PATTERNS
function generateMultiplicationPattern(grade, pattern, difficulty) {
    let num1, num2, answer;

    switch(pattern) {
        case 'multiply_by_zero':
            // Multiplication by zero
            num1 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            num2 = 0;
            if (Math.random() < 0.5) [num1, num2] = [num2, num1];
            answer = 0;
            break;

        case 'multiply_by_one':
            // Multiplication by one
            num1 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            num2 = 1;
            if (Math.random() < 0.5) [num1, num2] = [num2, num1];
            answer = num1;
            break;

        case 'times_tables':
            // Times tables (up to 10×10)
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            break;

        case 'large_multiplication':
            // Multiplication beyond 12
            num1 = Math.max(13, getRandomNumberWithDifficulty(grade, difficulty, 'multiplication'));
            num2 = Math.max(13, getRandomNumberWithDifficulty(grade, difficulty, 'multiplication'));
            // Keep reasonable for mental math
            if (num1 > 20) num1 = Math.floor(num1 / 2);
            if (num2 > 20) num2 = Math.floor(num2 / 2);
            answer = num1 * num2;
            break;

        case 'basic_multiplication':
        default:
            // Basic multiplication
            num1 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            num2 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            if (Math.abs(num1) > 50) num1 = Math.floor(num1 / 10);
            if (Math.abs(num2) > 50) num2 = Math.floor(num2 / 10);
            answer = num1 * num2;
            break;
    }

    return {
        num1,
        num2,
        operation: 'multiplication',
        answer,
        problemText: `${num1} × ${num2} = ?`
    };
}

// DIVISION PATTERNS
function generateDivisionPattern(grade, pattern, difficulty) {
    let num1, num2, answer;

    switch(pattern) {
        case 'division_with_remainder':
            // Division with remainders
            num2 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            if (num2 === 0) num2 = Math.random() > 0.5 ? 1 : 2;
            answer = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            num1 = answer * num2 + Math.floor(Math.random() * (num2 - 1)) + 1; // Add remainder
            break;

        case 'divide_by_one':
            // Division by one
            num2 = 1;
            answer = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            num1 = answer;
            break;

        case 'divide_same_number':
            // Dividing number by itself
            num1 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            if (num1 === 0) num1 = Math.floor(Math.random() * 10) + 1;
            num2 = num1;
            answer = 1;
            break;

        case 'fraction_result':
            // Division resulting in fractions (num1 < num2)
            num2 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            if (num2 === 0) num2 = Math.floor(Math.random() * 10) + 2;
            num1 = Math.floor(Math.random() * num2);
            if (num1 === 0) num1 = 1;
            answer = num1 / num2; // This will be a fraction
            break;

        case 'large_division':
            // Division with large numbers (≥100)
            num2 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            if (num2 === 0 || num2 < 2) num2 = Math.floor(Math.random() * 10) + 2;
            answer = Math.max(10, getRandomNumberWithDifficulty(grade, difficulty, 'multiplication'));
            num1 = answer * num2;
            // Ensure num1 is actually large
            if (num1 < 100) num1 = answer * (num2 + 10);
            break;

        case 'basic_division':
        default:
            // Basic division (whole number results)
            num2 = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            if (num2 === 0) num2 = Math.random() > 0.5 ? 1 : 2;
            answer = getRandomNumberWithDifficulty(grade, difficulty, 'multiplication');
            num1 = answer * num2;
            break;
    }

    return {
        num1,
        num2,
        operation: 'division',
        answer,
        problemText: `${num1} ÷ ${num2} = ?`
    };
}

// Show the next question
function showNextQuestion() {
    // Stop any ongoing emotion animation
    if (emotionAnimationInterval) {
        clearInterval(emotionAnimationInterval);
        emotionAnimationInterval = null;
    }

    if (currentQuestion >= quizQuestions.length) {
        endQuiz();
        return;
    }

    const problem = quizQuestions[currentQuestion];

    // Display problem based on format (vertical or horizontal)
    if (problem.isVertical && problem.problemText.startsWith('VERTICAL:')) {
        displayVerticalProblem(problem.problemText);
    } else {
        // Standard horizontal display
        problemDisplay.innerHTML = problem.problemText;
        problemDisplay.classList.remove('vertical-format');
        // Also remove from parent for mobile avatar scaling
        problemDisplay.parentElement.classList.remove('vertical-format');
    }

    // Reset input based on device type
    if (isNumberPadActive) {
        resetNumberPad();
    } else {
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();
    }

    submitBtn.disabled = false;
    updateFeedback('', 'feedback');
    updateFeedbackAnswer('', 'none');

    // Update question counter
    questionCounterDisplay.textContent = `${currentQuestion + 1}/10`;

    // Track question start time for AI agent
    questionStartTime = Date.now();

    // Start timer
    startTimer();
}

/**
 * Display a problem in vertical columnar format
 * Parses the VERTICAL:num1:num2:operator:result format
 */
function displayVerticalProblem(problemText) {
    const parts = problemText.split(':');
    if (parts.length !== 5 || parts[0] !== 'VERTICAL') {
        // Fallback to horizontal if parsing fails
        problemDisplay.innerHTML = problemText;
        return;
    }

    const [, num1, num2, operator, result] = parts;

    // Build vertical HTML structure
    const verticalHTML = `
        <div class="problem-vertical-container">
            <div class="problem-vertical-line">
                <span class="problem-vertical-number">${num1}</span>
            </div>
            <div class="problem-vertical-line">
                <span class="problem-vertical-operator">${operator}</span>
                <span class="problem-vertical-number">${num2}</span>
            </div>
            <div class="problem-vertical-separator"></div>
            <div class="problem-vertical-line">
                <span class="problem-vertical-result">${result}</span>
            </div>
        </div>
    `;

    problemDisplay.innerHTML = verticalHTML;
    problemDisplay.classList.add('vertical-format');
    // Also add to parent for mobile avatar scaling
    problemDisplay.parentElement.classList.add('vertical-format');
}

// Start the countdown timer
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timeRemaining = timePerQuestion;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

// Update timer display and bar
function updateTimerDisplay() {
    timerDisplay.textContent = `${timeRemaining}s`;
    const percentage = (timeRemaining / timePerQuestion) * 100;
    timerBar.style.width = `${percentage}%`;
}

// Handle timeout
function handleTimeout() {
    const problem = quizQuestions[currentQuestion];

    answerInput.disabled = true;
    submitBtn.disabled = true;

    updateFeedback(`⏰ Time's up! Answer: ${problem.answer}`, 'feedback incorrect');
    updateFeedbackAnswer('', 'none'); // Hide secondary feedback line

    totalAttempted++;

    // Show emotional progression for timeout (treated as wrong answer)
    showEmotionalProgression(false);

    // Auto-advance to next question after showing feedback (2.5 seconds - longer to read answer)
    setTimeout(() => {
        currentQuestion++;
        updateFeedback('', 'feedback');
        updateFeedbackAnswer('', 'none');
        showNextQuestion();
    }, 2500);
}

// Submit answer
function submitAnswer() {
    // CRITICAL: Disable submit button immediately to prevent multiple clicks
    submitBtn.disabled = true;
    const numberPadSubmitBtn = document.getElementById('number-pad-submit');
    if (numberPadSubmitBtn) {
        numberPadSubmitBtn.disabled = true;
    }

    const problem = quizQuestions[currentQuestion];

    // Get answer from number pad or text input
    let userAnswer;
    if (isNumberPadActive) {
        userAnswer = getNumberPadValue();
    } else {
        userAnswer = parseInt(answerInput.value);
    }

    // Validate input BEFORE clearing timer
    if (isNaN(userAnswer)) {
        updateFeedback('Please enter a number!', 'feedback incorrect');
        // Re-enable submit button since validation failed
        submitBtn.disabled = false;
        if (numberPadSubmitBtn) {
            numberPadSubmitBtn.disabled = false;
        }
        // Don't clear or restart timer - let it continue
        return;
    }

    // Only clear timer after validation passes
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    totalAttempted++;
    answerInput.disabled = true;

    // Calculate time taken for AI tracking
    const timeTaken = (Date.now() - questionStartTime) / 1000; // Convert to seconds
    const isCorrect = userAnswer === problem.answer;

    // Track attempt with AI agent
    if (aiAgent) {
        aiAgent.trackAttempt(problem, isCorrect, timeTaken);
    }

    if (isCorrect) {
        // Correct answer
        totalCorrect++;
        quizCorrect++;

        // Calculate points based on time and level
        let points = 10;
        if (timeRemaining >= timePerQuestion * 0.75) points += 5; // Speed bonus
        points += currentLevel; // Level bonus

        quizScore += points;
        totalScore += points;

        updateFeedback(`🎉 Correct! +${points} points`, 'feedback correct');
        updateFeedbackAnswer('', 'none');

        scoreDisplay.textContent = totalScore;

        // Show emotional progression for correct answer
        showEmotionalProgression(true);

        // Auto-advance to next question after showing feedback (1.5 seconds)
        setTimeout(() => {
            currentQuestion++;
            updateFeedback('', 'feedback');
            showNextQuestion();
        }, 1500);
    } else {
        // Incorrect answer
        updateFeedback(`❌ Wrong! Answer: ${problem.answer}`, 'feedback incorrect');
        updateFeedbackAnswer('', 'none'); // Hide secondary feedback line

        // Show emotional progression for wrong answer
        showEmotionalProgression(false);

        // Auto-advance to next question after showing feedback (2.5 seconds - longer to read answer)
        setTimeout(() => {
            currentQuestion++;
            updateFeedback('', 'feedback');
            updateFeedbackAnswer('', 'none');
            showNextQuestion();
        }, 2500);
    }
}

// Removed handleContinue function - using auto-advance instead

// Emotion progression order: sad → shocked → neutral → happy → excited
const emotionOrder = ['sad', 'shocked', 'neutral', 'happy', 'excited'];

function getEmotionIndex(emotion) {
    return emotionOrder.indexOf(emotion);
}

// Determine next emotion based on answer and current state
function getNextEmotion(isCorrect) {
    const totalQuestions = currentQuestion + 1;
    const accuracy = quizCorrect / totalQuestions;

    avatarCorrectDisplay.textContent = quizCorrect;

    // Update mobile avatar counter (if exists)
    if (mobileAvatarCorrect) {
        mobileAvatarCorrect.textContent = quizCorrect;
    }

    // Minimum threshold: Need at least 3 questions answered to move from neutral
    if (totalQuestions < 3) {
        return 'neutral'; // Stay neutral, no animation
    }

    // Get current emotion index in the order array
    const currentIdx = getEmotionIndex(currentEmotion);

    // After threshold, determine if we should move one step based on trend
    // First, check if current emotion is sustainable with current accuracy
    // If not, move down one level regardless of whether answer was correct
    if (currentEmotion === 'excited' && accuracy < 0.8) {
        // Can't maintain excited with less than 80% accuracy
        return emotionOrder[currentIdx - 1]; // excited → happy
    } else if (currentEmotion === 'happy' && accuracy < 0.66) {
        // Can't maintain happy with less than 66% accuracy
        return emotionOrder[currentIdx - 1]; // happy → neutral
    }

    if (isCorrect) {
        // Positive answer - consider moving upward (one step only)
        // Only move if we're not already at the top (excited)
        if (currentIdx < emotionOrder.length - 1) {
            // Use different thresholds based on current position
            if (currentEmotion === 'neutral') {
                // From neutral, need strong positive trend to move to happy
                if (accuracy >= 0.66) {
                    return emotionOrder[currentIdx + 1]; // neutral → happy
                }
            } else if (currentEmotion === 'sad' || currentEmotion === 'shocked') {
                // From negative emotions, allow recovery with modest improvement
                // Move up if accuracy is improving (above 50%)
                if (accuracy >= 0.5) {
                    return emotionOrder[currentIdx + 1]; // sad → shocked or shocked → neutral
                }
            } else if (currentEmotion === 'happy') {
                // From happy to excited, need very strong trend
                if (accuracy >= 0.8) {
                    return emotionOrder[currentIdx + 1]; // happy → excited
                }
            }
        }
        // Stay at current emotion
        return currentEmotion;
    } else {
        // Negative answer - consider moving downward (one step only)
        // Only move if we're not already at the bottom (sad)
        if (currentIdx > 0) {
            // Move down if accuracy drops below 50%
            if (accuracy < 0.5) {
                return emotionOrder[currentIdx - 1];
            }
        }
        // Stay at current emotion
        return currentEmotion;
    }
}

// Show emotional progression after answer with smooth sliding transitions and looping
function showEmotionalProgression(isCorrect) {
    // Clear any existing animation interval
    if (emotionAnimationInterval) {
        clearInterval(emotionAnimationInterval);
        emotionAnimationInterval = null;
    }

    // Get the next emotion based on current state and answer
    const nextEmotion = getNextEmotion(isCorrect);

    // If staying neutral (below threshold), no animation needed
    if (nextEmotion === 'neutral' && currentEmotion === 'neutral') {
        return;
    }

    // If emotion hasn't changed, no animation needed
    if (nextEmotion === currentEmotion) {
        return;
    }

    // Build transition path from current to next emotion
    const currentIdx = getEmotionIndex(currentEmotion);
    const nextIdx = getEmotionIndex(nextEmotion);
    const transitionPath = [];

    // Build the single-direction path
    if (currentIdx < nextIdx) {
        // Moving up (e.g., neutral → happy, shocked → neutral, happy → excited)
        for (let i = currentIdx + 1; i <= nextIdx; i++) {
            transitionPath.push(emotionOrder[i]);
        }
    } else if (currentIdx > nextIdx) {
        // Moving down (e.g., happy → neutral, neutral → shocked, shocked → sad)
        for (let i = currentIdx - 1; i >= nextIdx; i--) {
            transitionPath.push(emotionOrder[i]);
        }
    }

    // If no path (shouldn't happen), exit
    if (transitionPath.length === 0) {
        return;
    }

    // Execute the transition with looping animation
    let currentStep = 0;
    const stepDuration = 800; // 800ms per step

    function animateStep() {
        const emotion = transitionPath[currentStep];

        // Set base to previous emotion
        if (currentStep === 0) {
            avatarImageBase.src = `avatars/${avatarGender}-${currentEmotion}.png`;
        } else {
            avatarImageBase.src = `avatars/${avatarGender}-${transitionPath[currentStep - 1]}.png`;
        }
        avatarImageBase.classList.remove('bounce');

        // Overlay shows the new emotion
        avatarImageOverlay.src = `avatars/${avatarGender}-${emotion}.png`;
        avatarImageOverlay.classList.remove('bounce');
        avatarImageOverlay.classList.add('show');

        // Update mobile avatar image (if exists) - use the current emotion being displayed
        if (mobileAvatarImage) {
            mobileAvatarImage.src = `avatars/${avatarGender}-${emotion}.png`;
        }

        // Add bounce animation if final emotion is excited
        if (currentStep === transitionPath.length - 1 && emotion === 'excited') {
            avatarImageOverlay.classList.add('bounce');
        }

        // Update current emotion when we reach the final state
        if (currentStep === transitionPath.length - 1) {
            currentEmotion = emotion;

            // Loop back to the beginning for continuous animation
            currentStep = 0;
        } else {
            currentStep++;
        }
    }

    // Start the animation immediately
    animateStep();

    // Continue animating in a loop
    emotionAnimationInterval = setInterval(animateStep, stepDuration);
}

// Calculate crowns based on performance
function calculateCrowns(correctAnswers) {
    if (correctAnswers === 10) return 3; // Perfect score
    if (correctAnswers >= 8) return 2;   // Great score
    if (correctAnswers >= 7) return 1;   // Good score
    return 0; // No crowns
}

// End the quiz
function endQuiz() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Stop any ongoing emotion animation
    if (emotionAnimationInterval) {
        clearInterval(emotionAnimationInterval);
        emotionAnimationInterval = null;
    }

    // Re-enable settings
    gradeSelect.disabled = false;

    // Calculate accuracy
    const accuracy = Math.round((quizCorrect / 10) * 100);

    // Calculate crowns earned
    const crownsEarned = calculateCrowns(quizCorrect);
    totalCrowns += crownsEarned;
    totalCrownsDisplay.textContent = totalCrowns;

    // Update mobile crowns display
    if (totalCrownsMobile) {
        totalCrownsMobile.textContent = totalCrowns;
    }

    // Save level completion data
    saveLevelCompletion(currentLevel, crownsEarned);

    // Display crowns collected and hide/show container
    crownsEarnedDisplay.innerHTML = '';
    if (crownsEarned > 0) {
        crownRewardContainer.style.display = 'block';

        // Add "Crowns Collected:" label
        const label = document.createElement('span');
        label.textContent = 'Crowns Collected: ';
        label.className = 'crowns-label';
        crownsEarnedDisplay.appendChild(label);

        // Create crown container with badge
        const crownContainer = document.createElement('div');
        crownContainer.className = 'crown-collected-container';

        // Add crown image
        const crownImg = document.createElement('img');
        crownImg.src = 'avatars/crown.png';
        crownImg.alt = 'Crown';
        crownImg.className = 'crown-collected-icon';
        crownContainer.appendChild(crownImg);

        // Add badge with count
        const badge = document.createElement('div');
        badge.className = 'crown-collected-badge';
        badge.textContent = crownsEarned;
        crownContainer.appendChild(badge);

        crownsEarnedDisplay.appendChild(crownContainer);
    } else {
        // Hide the crown reward container when no crowns collected
        crownRewardContainer.style.display = 'none';
    }

    // Update result displays
    quizCorrectDisplay.textContent = `${quizCorrect}/10`;
    quizScoreDisplay.textContent = quizScore;
    quizAccuracyDisplay.textContent = `${accuracy}%`;

    // Check if advancing to next level
    const maxLevel = 10; // Maximum level based on grade curriculum
    const isReplayingLowerLevel = currentLevel < maxLevelAchieved;

    if (quizCorrect >= 7) {
        // Level passed - show next level button
        resultsHeading.textContent = '🎉 Mission Accomplished! 🎉';
        // Show the wrapper for successful level completion
        const continueWrapper = document.querySelector('.continue-level-btn-wrapper');

        if (isReplayingLowerLevel) {
            // User is replaying a lower level - restore to max level and hide GO button
            levelUpHeading.innerHTML = '🎉 Mission Completed! 🎉';
            levelUpText.innerHTML = 'Great practice! Returning to your current progress.';
            // Hide the GO button since we're not advancing
            if (continueWrapper) {
                continueWrapper.style.display = 'none';
            }
            // Restore to max level achieved
            currentLevel = maxLevelAchieved;
        } else if (currentLevel >= maxLevel) {
            // Just completed level 10 or already at level 10+ (shouldn't happen but safety check)
            const grade = parseInt(gradeSelect.value);
            levelUpHeading.innerHTML = '👑 All Missions Conquered! 👑';
            levelUpText.innerHTML = `You are now a Grade ${grade} Math Master!<br>Keep practicing to maintain your skills.`;
            nextLevelBtn.innerHTML = '<img src="avatars/go.png" alt="Continue">';

            // Increment to level 11 to mark as completed
            currentLevel++;
            maxLevelAchieved = currentLevel;

            // Hide mission details (time per question) since all levels are complete
            const missionDetails = document.querySelectorAll('.mission-details');
            missionDetails.forEach(detail => detail.style.display = 'none');

            // Hide the entire wrapper to hide the GO button and rotating border
            if (continueWrapper) {
                continueWrapper.style.display = 'none';
            }
        } else {
            // Regular level up - advance to next level
            levelUpHeading.textContent = '🌟 Level Up! 🌟';
            currentLevel++;
            maxLevelAchieved = currentLevel; // Update max level achieved
            updateTimeDisplay();
            nextTimeDisplay.textContent = timePerQuestion;
            levelUpText.innerHTML = `<span class="level-mission-text">Next Mission:</span>`;
            nextLevelBtn.innerHTML = '<img src="avatars/go.png" alt="Continue">';
            if (continueWrapper) {
                continueWrapper.style.display = 'flex';
            }
        }
    } else {
        // Level failed
        resultsHeading.textContent = '😔 Mission Failed! 😔';
        const continueWrapper = document.querySelector('.continue-level-btn-wrapper');

        if (isReplayingLowerLevel) {
            // User failed a lower level replay - restore to max level
            levelUpHeading.innerHTML = 'Better luck next time!';
            levelUpText.innerHTML = 'Returning to your current progress.';
            currentLevel = maxLevelAchieved;
        } else {
            // User failed at their current max level
            levelUpHeading.innerHTML = 'Keep practicing to earn crowns!';
            levelUpText.innerHTML = `<span class="level-mission-text">Retry Mission:</span>`;
            nextTimeDisplay.textContent = timePerQuestion;
        }

        // Hide the entire wrapper to also hide the rotating border pseudo-element
        if (continueWrapper) {
            continueWrapper.style.display = 'none';
        }
    }

    // Update best streak
    if (quizCorrect > bestStreak) {
        bestStreak = quizCorrect;
    }

    // Update and save stats
    updateStats();
    saveProfileData();

    // Update time display to reflect current level
    updateTimeDisplay();

    // Show results screen
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    // Hide score-board when quiz ends
    if (scoreBoardRow) scoreBoardRow.style.display = 'none';
    // Keep explore map button hidden during results
    if (viewMapBtnStart) viewMapBtnStart.classList.add('hidden');

    // Show player-info-row (π + player info panel) on results screen (user needs access to progress button)
    const playerInfoRow = document.querySelector('.player-info-row');
    if (playerInfoRow) playerInfoRow.style.display = 'flex';

    // Hide avatar section, hide stats section, and show level-up section
    const avatarSection = document.getElementById('avatar-section');
    const statsSection = document.getElementById('stats-section');
    if (avatarSection) avatarSection.classList.add('hidden');
    if (statsSection) statsSection.classList.add('hidden');

    // Show both mobile and desktop level-up sections (CSS will hide the appropriate one)
    if (levelUpSection) levelUpSection.classList.remove('hidden');
    if (levelUpSectionDesktop) {
        levelUpSectionDesktop.classList.remove('hidden');
        // Sync desktop version with mobile version content
        syncLevelUpDesktop();
    }
}

// Sync desktop level-up section with mobile version
function syncLevelUpDesktop() {
    if (levelUpHeadingDesktop && levelUpHeading) {
        levelUpHeadingDesktop.textContent = levelUpHeading.textContent;
    }
    if (levelUpTextDesktop && levelUpText) {
        levelUpTextDesktop.textContent = levelUpText.textContent;
    }
    if (nextTimeDisplayDesktop && nextTimeDisplay) {
        nextTimeDisplayDesktop.textContent = nextTimeDisplay.textContent;
    }
}

// Update statistics display
function updateStats() {
    totalAttemptedDisplay.textContent = totalAttempted;
    totalCorrectDisplay.textContent = totalCorrect;
    bestStreakDisplay.textContent = bestStreak;

    const accuracy = totalAttempted > 0
        ? Math.round((totalCorrect / totalAttempted) * 100)
        : 0;
    accuracyDisplay.textContent = `${accuracy}%`;
}

// Level position coordinates for each grade map (percentage-based for responsiveness)
// Each coordinate is [left%, top%] representing position on the circular map
const levelMapCoordinates = {
    1: [ // Grade 1 - Beach Quest
        [30, 85], [15, 70], [25, 55], [40, 45], [30, 30],
        [50, 20], [70, 30], [80, 45], [70, 60], [60, 75]
    ],
    2: [ // Grade 2 - Forest Quest
        [50, 85], [30, 75], [20, 60], [25, 40], [40, 25],
        [60, 20], [75, 30], [80, 50], [70, 70], [55, 75]
    ],
    3: [ // Grade 3 - Cave Quest
        [50, 90], [35, 75], [25, 60], [30, 40], [45, 28],
        [60, 25], [75, 35], [80, 55], [65, 70], [50, 75]
    ],
    4: [ // Grade 4 - Farm/Garden Quest
        [20, 85], [15, 65], [25, 45], [35, 30], [50, 18],
        [65, 25], [78, 40], [82, 60], [70, 75], [50, 85]
    ],
    5: [ // Grade 5 - Meadow Quest
        [25, 88], [18, 68], [28, 50], [40, 32], [52, 20],
        [68, 28], [80, 45], [80, 65], [65, 78], [48, 85]
    ],
    6: [ // Grade 6 - Castle/Kingdom Quest
        [50, 88], [32, 78], [22, 62], [25, 42], [38, 28],
        [55, 18], [72, 28], [82, 48], [75, 68], [58, 80]
    ],
    7: [ // Grade 7 - Jungle/Rainforest Quest
        [28, 85], [20, 68], [25, 50], [35, 35], [48, 22],
        [62, 25], [75, 38], [82, 55], [72, 72], [55, 82]
    ],
    8: [ // Grade 8 - Desert Quest
        [50, 88], [35, 75], [25, 58], [30, 40], [45, 25],
        [60, 22], [75, 35], [82, 52], [70, 68], [55, 80]
    ],
    9: [ // Grade 9 - Arctic/Ice Quest
        [50, 85], [32, 72], [22, 55], [28, 38], [42, 25],
        [58, 20], [72, 32], [80, 50], [68, 68], [52, 78]
    ],
    10: [ // Grade 10 - Volcano/Space Quest
        [48, 88], [35, 72], [25, 55], [30, 38], [45, 25],
        [60, 22], [75, 35], [82, 52], [70, 70], [55, 82]
    ]
};

// Create SVG path overlay for operation-specific visualization
function createOperationPath(coordinates, operation) {
    // Get operation color
    const operationStyle = operationColors[operation];
    if (!operationStyle) return null;

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'operation-path-overlay');
    svg.setAttribute('viewBox', '0 0 100 100');

    // Create smooth bezier curve path through all coordinates
    let pathData = '';

    for (let i = 0; i < coordinates.length; i++) {
        const [x, y] = coordinates[i];

        if (i === 0) {
            // Start point
            pathData = `M ${x} ${y}`;
        } else {
            // Calculate control points for smooth curve
            const [prevX, prevY] = coordinates[i - 1];
            const [nextX, nextY] = i < coordinates.length - 1 ? coordinates[i + 1] : [x, y];

            // Use quadratic bezier curve for smooth transitions
            const controlX = (prevX + x) / 2;
            const controlY = (prevY + y) / 2;

            pathData += ` Q ${controlX} ${controlY}, ${x} ${y}`;
        }
    }

    // Create the path element
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', 'operation-path');
    path.setAttribute('stroke', operationStyle.color);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('filter', 'url(#glow)');

    // Create glow filter
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '1');
    feGaussianBlur.setAttribute('result', 'coloredBlur');

    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');

    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    defs.appendChild(filter);

    svg.appendChild(defs);
    svg.appendChild(path);

    return svg;
}

// Level Map Functions
function openLevelMap() {
    // Set displayed grade to current grade
    displayedGrade = parseInt(gradeSelect.value);
    renderLevelMap(displayedGrade);

    // Show modal
    levelMapModal.classList.remove('hidden');
}

function renderLevelMap(grade) {
    // Update grade display
    mapGradeDisplay.textContent = grade;

    // Set background image for the grade map (operation-specific with fallback)
    const operationSuffix = getOperationSuffix(selectedOperation);
    const operationMapImage = `avatars/grade-${grade}-${operationSuffix}.png`;
    const fallbackMapImage = `avatars/grade-${grade}.png`;

    // Try to load operation-specific map, fallback to general map if not found
    const img = new Image();
    let useOperationPath = false; // Flag to determine if we need SVG path overlay

    img.onload = () => {
        levelMapContainer.style.backgroundImage = `url('${operationMapImage}')`;
        useOperationPath = false; // Operation-specific map loaded, no need for SVG overlay

        // Hide legend when operation-specific map is loaded
        if (operationLegend) {
            operationLegend.classList.add('hidden');
        }
    };
    img.onerror = () => {
        levelMapContainer.style.backgroundImage = `url('${fallbackMapImage}')`;
        useOperationPath = true; // Fallback map loaded, use SVG path overlay

        // Add SVG path overlay after a brief delay to ensure container is ready
        setTimeout(() => {
            const coordinates = levelMapCoordinates[grade];
            const svgPath = createOperationPath(coordinates, selectedOperation);
            if (svgPath) {
                // Remove any existing SVG overlay
                const existingOverlay = levelMapContainer.querySelector('.operation-path-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
                // Insert SVG as first child (below level nodes)
                levelMapContainer.insertBefore(svgPath, levelMapContainer.firstChild);

                // Update and show legend
                const operationStyle = operationColors[selectedOperation];
                if (operationStyle && operationLegend && legendIcon && legendText) {
                    legendIcon.style.backgroundColor = operationStyle.color;
                    legendText.textContent = `Following: ${operationStyle.name}`;
                    operationLegend.classList.remove('hidden');
                }
            }
        }, 50);
    };
    img.src = operationMapImage;

    // Get level completion data from profile (operation-specific)
    const profile = profiles[currentProfile];
    const levelData = profile.levelCompletion || {};
    const gradeKey = `grade${grade}`;
    const gradeData = levelData[gradeKey] || {};
    const gradeLevels = gradeData[selectedOperation] || {};

    // Get coordinates for this grade
    const coordinates = levelMapCoordinates[grade];

    // Clear existing level nodes
    levelMapContainer.innerHTML = '';

    // Get current grade and level from the active game
    const activeGrade = parseInt(gradeSelect.value);
    const activeLevel = currentLevel;

    // Generate 10 level nodes
    for (let level = 1; level <= 10; level++) {
        const levelNode = document.createElement('div');
        levelNode.className = 'level-node';

        // Position the node using coordinates
        const [left, top] = coordinates[level - 1];
        levelNode.style.left = `${left}%`;
        levelNode.style.top = `${top}%`;

        const levelCard = document.createElement('div');
        levelCard.className = 'level-card';

        // Determine level state based on whether this is the active grade
        let state = 'locked';
        let crownsEarned = 0;

        const levelInfo = gradeLevels[level];

        if (grade === activeGrade) {
            // For the active grade, use current level to determine state
            if (level < activeLevel) {
                state = 'completed';
                // Extract crowns from level data
                if (levelInfo) {
                    crownsEarned = levelInfo.crowns || levelInfo || 0;
                }
            } else if (level === activeLevel) {
                // Check if this level has been completed (has crown data)
                // This handles the case where user is at max level (10) and has completed it
                if (levelInfo && levelInfo.crowns > 0) {
                    state = 'completed';
                    crownsEarned = levelInfo.crowns;
                } else {
                    state = 'current';
                }
            }
        } else {
            // For other grades, check if levels have been completed
            if (levelInfo && levelInfo.crowns > 0) {
                state = 'completed';
                crownsEarned = levelInfo.crowns;
            }
        }

        levelCard.classList.add(state);

        // Build level card HTML - just the level number
        levelCard.innerHTML = `
            <div class="level-number">${level}</div>
            ${crownsEarned > 0 ? `
                <div class="level-crowns">
                    ${Array(crownsEarned).fill('<img src="avatars/crown.png" alt="Crown">').join('')}
                </div>
            ` : ''}
        `;

        // Add click handler for unlocked levels
        if (state !== 'locked') {
            levelCard.addEventListener('click', () => {
                // If clicking on a different grade, switch to it
                if (grade !== activeGrade) {
                    gradeSelect.value = grade;
                    updateTimeDisplay();
                    // Update desktop grade display
                    if (currentGradeDesktop) {
                        currentGradeDesktop.textContent = grade;
                    }
                    // Update mobile grade display
                    if (currentGradeMobile) {
                        currentGradeMobile.textContent = grade;
                    }
                }
                currentLevel = level;
                closeLevelMap();
                startQuiz();
            });
        }

        levelNode.appendChild(levelCard);
        levelMapContainer.appendChild(levelNode);
    }

    // Update navigation button states
    updateNavButtons();
}

function updateNavButtons() {
    // Disable previous button if at grade 1
    prevGradeBtn.disabled = (displayedGrade <= 1);

    // Disable next button if at grade 10
    nextGradeBtn.disabled = (displayedGrade >= 10);
}

function showPreviousGrade() {
    if (displayedGrade > 1) {
        displayedGrade--;
        renderLevelMap(displayedGrade);
    }
}

function showNextGrade() {
    if (displayedGrade < 10) {
        displayedGrade++;
        renderLevelMap(displayedGrade);
    }
}

function closeLevelMap() {
    levelMapModal.classList.add('hidden');
    // Modal closes - underlying screen state remains unchanged
    // (could be start screen, level-up screen, or results screen)
}

// Track level completion in profile (operation-specific)
function saveLevelCompletion(level, crowns) {
    if (currentProfile && profiles[currentProfile]) {
        const profile = profiles[currentProfile];

        // Initialize levelCompletion if it doesn't exist
        if (!profile.levelCompletion) {
            profile.levelCompletion = {};
        }

        const currentGrade = parseInt(gradeSelect.value);
        const gradeKey = `grade${currentGrade}`;

        // Initialize grade data if it doesn't exist
        if (!profile.levelCompletion[gradeKey]) {
            profile.levelCompletion[gradeKey] = {};
        }

        // Initialize operation data if it doesn't exist
        if (!profile.levelCompletion[gradeKey][selectedOperation]) {
            profile.levelCompletion[gradeKey][selectedOperation] = {};
        }

        // Save level data (crowns and time) for this operation
        const existingData = profile.levelCompletion[gradeKey][selectedOperation][level] || { crowns: 0 };
        profile.levelCompletion[gradeKey][selectedOperation][level] = {
            crowns: Math.max(existingData.crowns || 0, crowns),
            timePerQuestion: timePerQuestion,
            lastPlayed: new Date().toISOString()
        };

        saveProfiles();
    }
}

// =============================================================================
// THEME MANAGER - Dark Mode Support
// =============================================================================

const ThemeManager = {
    STORAGE_KEY: 'pi-app-theme',
    THEMES: { LIGHT: 'light', DARK: 'dark' },

    // Initialize theme system
    init() {
        const theme = this.getPreferredTheme();
        this.applyTheme(theme);
        this.setupToggleButton();
        this.watchSystemPreference();
        this.updateToggleIcon(theme);
    },

    // Get user's preferred theme
    getPreferredTheme() {
        // 1. Check localStorage first (manual preference)
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved && Object.values(this.THEMES).includes(saved)) {
            return saved;
        }

        // 2. Fall back to system preference
        return this.getSystemPreference();
    },

    // Get system color scheme preference
    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? this.THEMES.DARK
            : this.THEMES.LIGHT;
    },

    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeLight = document.querySelector('meta[name="theme-color"][media*="light"]');
        const metaThemeDark = document.querySelector('meta[name="theme-color"][media*="dark"]');

        if (theme === this.THEMES.DARK) {
            if (metaThemeLight) metaThemeLight.content = '#1a1a1a';
            if (metaThemeDark) metaThemeDark.content = '#1a1a1a';
        } else {
            if (metaThemeLight) metaThemeLight.content = '#667eea';
            if (metaThemeDark) metaThemeDark.content = '#667eea';
        }
    },

    // Save user preference
    setTheme(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
        this.applyTheme(theme);
        this.updateToggleIcon(theme);
    },

    // Toggle between light and dark
    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
        this.setTheme(next);

        // Add animation class
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.classList.add('animating');
            setTimeout(() => toggleBtn.classList.remove('animating'), 500);
        }
    },

    // Update toggle button icon based on current theme
    updateToggleIcon(theme) {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');

        if (!sunIcon || !moonIcon) return;

        if (theme === this.THEMES.DARK) {
            // Dark mode active - show sun icon (to switch to light)
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            // Light mode active - show moon icon (to switch to dark)
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    },

    // Setup toggle button click handler
    setupToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    // Listen for system preference changes
    watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only update if user hasn't manually set a preference
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (!saved) {
                const newTheme = e.matches ? this.THEMES.DARK : this.THEMES.LIGHT;
                this.applyTheme(newTheme);
                this.updateToggleIcon(newTheme);
            }
        });
    }
};

// Initialize theme manager
ThemeManager.init();

// Initialize the game when the page loads
init();
