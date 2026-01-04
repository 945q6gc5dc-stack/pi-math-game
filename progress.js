/**
 * Progress Page Script for Pi - Practice Intelligence
 * Author: Kumar Srinivasan
 */

// Global variables
let aiAgent = null;
let currentProfile = null;
let profiles = {};

/**
 * Switch between segment panels in the modern segmented control
 */
function switchSegment(segmentName) {
    // Remove active class from all segment buttons
    const allButtons = document.querySelectorAll('.segment-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked button
    const activeButton = document.querySelector(`[data-segment="${segmentName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Hide all segment panels
    const allPanels = document.querySelectorAll('.segment-panel');
    allPanels.forEach(panel => panel.classList.remove('active'));

    // Show the selected segment panel
    const activePanel = document.getElementById(`segment-${segmentName}`);
    if (activePanel) {
        activePanel.classList.add('active');
    }
}

// Make switchSegment globally available
window.switchSegment = switchSegment;

// DOM elements
const backToGameBtn = document.getElementById('back-to-game-btn');
const progressPlayerName = document.getElementById('progress-player-name');
const progressProfileSelection = document.getElementById('progress-profile-selection');
const progressProfileList = document.getElementById('progress-profile-list');
const progressDashboard = document.getElementById('progress-dashboard');

// Stats elements
const overallAccuracyDisplay = document.getElementById('overall-accuracy');
const totalProblemsDisplay = document.getElementById('total-problems');
const avgTimeDisplay = document.getElementById('avg-time');

// AI insights elements
const aiInsightsContent = document.getElementById('ai-insights-content');
const generateAIBtn = document.getElementById('generate-ai-btn');
const apiSetup = document.getElementById('api-setup');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');

// Other elements
const recommendationsList = document.getElementById('recommendations-list');
const operationsGrid = document.getElementById('operations-grid');
const weakPatternsList = document.getElementById('weak-patterns-list');
const strengthsList = document.getElementById('strengths-list');
const recentActivity = document.getElementById('recent-activity');

/**
 * Initialize progress page
 */
function initialize() {
    loadProfiles();
    renderProfileSelection();

    // Event listeners
    backToGameBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    generateAIBtn.addEventListener('click', generateAIInsights);
    saveApiKeyBtn.addEventListener('click', saveApiKey);

    // Check if profile was passed via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('profile');
    if (profileId && profiles[profileId]) {
        selectProfile(profileId);
    }
}

/**
 * Load profiles from localStorage
 */
function loadProfiles() {
    const saved = localStorage.getItem('mathMasterProfiles');
    if (saved) {
        profiles = JSON.parse(saved);
    }
}

/**
 * Save profiles to localStorage
 */
function saveProfiles() {
    localStorage.setItem('mathMasterProfiles', JSON.stringify(profiles));
}

/**
 * Render profile selection
 */
function renderProfileSelection() {
    progressProfileList.innerHTML = '';

    if (Object.keys(profiles).length === 0) {
        progressProfileList.innerHTML = '<p class="empty-message">No profiles found. Please create a profile in the main game first.</p>';
        return;
    }

    Object.entries(profiles).forEach(([id, profile]) => {
        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';
        profileCard.onclick = () => selectProfile(id);

        const avatarImg = document.createElement('img');
        avatarImg.src = `avatars/${profile.avatarGender || 'boy'}-full.png`;
        avatarImg.alt = profile.name;
        avatarImg.className = 'profile-avatar';

        const profileName = document.createElement('div');
        profileName.className = 'profile-name';
        profileName.textContent = profile.name;

        const profileCrowns = document.createElement('div');
        profileCrowns.className = 'profile-crowns';
        profileCrowns.textContent = `👑 ${profile.crowns || 0}`;

        profileCard.appendChild(avatarImg);
        profileCard.appendChild(profileName);
        profileCard.appendChild(profileCrowns);
        progressProfileList.appendChild(profileCard);
    });
}

/**
 * Select a profile and show progress
 */
function selectProfile(profileId) {
    currentProfile = profileId;
    const profile = profiles[profileId];

    // Hide profile selection, show dashboard
    progressProfileSelection.classList.add('hidden');
    progressDashboard.classList.remove('hidden');

    // Update profile name display
    progressPlayerName.textContent = profile.name;

    // Initialize AI agent
    aiAgent = new PiAIAgent();
    aiAgent.initialize(profile);

    // Render all dashboard sections
    renderOverallStats();
    renderAIInsights();
    renderRecommendations();
    renderOperationStats();
    renderWeakPatterns();
    renderStrengths();
    renderRecentActivity();
}

/**
 * Render overall statistics
 */
function renderOverallStats() {
    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalTime = 0;

    Object.values(aiAgent.performanceData.operations).forEach(op => {
        totalAttempted += op.attempted;
        totalCorrect += op.correct;
        totalTime += op.avgTime * op.attempted;
    });

    const accuracy = totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(1) : 0;
    const avgTime = totalAttempted > 0 ? (totalTime / totalAttempted).toFixed(1) : 0;

    overallAccuracyDisplay.textContent = `${accuracy}%`;
    totalProblemsDisplay.textContent = totalAttempted;
    avgTimeDisplay.textContent = `${avgTime}s`;
}

/**
 * Render AI insights
 */
function renderAIInsights() {
    const apiStatus = aiAgent.getApiStatus();

    if (!apiStatus.enabled) {
        // Show API setup
        aiInsightsContent.innerHTML = '<p class="empty-message">Enable AI-powered insights with Claude API</p>';
        apiSetup.classList.remove('hidden');
        generateAIBtn.classList.add('hidden');
    } else {
        // API is enabled, show generate button
        aiInsightsContent.innerHTML = '<p class="loading-message">Click "Generate AI Insights" to get personalized feedback from Claude AI</p>';
        apiSetup.classList.add('hidden');
        generateAIBtn.classList.remove('hidden');
    }
}

/**
 * Generate AI insights using Claude API
 */
async function generateAIInsights() {
    aiInsightsContent.innerHTML = '<p class="loading-message">Generating insights... This may take a few seconds.</p>';
    generateAIBtn.disabled = true;
    generateAIBtn.textContent = 'Generating...';

    try {
        const insights = await aiAgent.generateAIInsights();

        if (insights) {
            // Parse and format the insights
            const formattedInsights = formatAIInsights(insights);
            aiInsightsContent.innerHTML = formattedInsights;
        } else {
            aiInsightsContent.innerHTML = '<p class="empty-message">Unable to generate AI insights. Please check your API key and try again.</p>';
        }
    } catch (error) {
        console.error('Error generating insights:', error);
        aiInsightsContent.innerHTML = '<p class="empty-message">Error generating insights. Please try again.</p>';
    } finally {
        generateAIBtn.disabled = false;
        generateAIBtn.textContent = 'Regenerate AI Insights';
    }
}

/**
 * Format AI insights for display
 */
function formatAIInsights(insights) {
    // Split insights into paragraphs and format
    const paragraphs = insights.split('\n\n').filter(p => p.trim());

    let formatted = '<div class="ai-insights-formatted">';
    paragraphs.forEach((paragraph) => {
        const trimmed = paragraph.trim();
        if (trimmed.match(/^\d+\./)) {
            // Numbered list item
            const content = trimmed.replace(/^\d+\.\s*/, '');
            formatted += `<div class="insight-section"><div class="insight-title">💡 ${content}</div></div>`;
        } else {
            // Regular paragraph
            formatted += `<p>${trimmed}</p>`;
        }
    });
    formatted += '</div>';

    return formatted;
}

/**
 * Save API key
 */
function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        alert('Please enter a valid API key');
        return;
    }

    aiAgent.setApiKey(apiKey);
    apiKeyInput.value = '';

    // Update the profile with AI agent data
    if (currentProfile && profiles[currentProfile]) {
        profiles[currentProfile] = {
            ...profiles[currentProfile],
            ...aiAgent.saveToProfile()
        };
        saveProfiles();
    }

    alert('API key saved successfully!');
    renderAIInsights();
}

/**
 * Render recommendations
 */
function renderRecommendations() {
    const analysis = aiAgent.analyzePerformance();
    recommendationsList.innerHTML = '';

    // Update badge count
    const badge = document.getElementById('recommendations-badge');
    badge.textContent = analysis.recommendations.length;

    if (analysis.recommendations.length === 0) {
        recommendationsList.innerHTML = '<p class="empty-message">Keep practicing to get personalized recommendations!</p>';
        return;
    }

    analysis.recommendations.forEach(rec => {
        const recItem = document.createElement('div');
        recItem.className = `recommendation-item priority-${rec.priority}`;

        const badge = document.createElement('span');
        badge.className = `recommendation-badge ${rec.type}`;
        badge.textContent = rec.type;

        const title = document.createElement('div');
        title.className = 'recommendation-title';
        title.textContent = rec.title;

        const description = document.createElement('div');
        description.className = 'recommendation-description';
        description.textContent = rec.description;

        recItem.appendChild(badge);
        recItem.appendChild(title);
        recItem.appendChild(description);
        recommendationsList.appendChild(recItem);
    });
}

/**
 * Render operation statistics
 */
function renderOperationStats() {
    operationsGrid.innerHTML = '';

    // Count operations with attempts
    const activeOps = Object.values(aiAgent.performanceData.operations).filter(s => s.attempted > 0).length;
    const badge = document.getElementById('operations-badge');
    badge.textContent = activeOps;

    Object.entries(aiAgent.performanceData.operations).forEach(([operation, stats]) => {
        if (stats.attempted === 0) return;

        const opStat = document.createElement('div');
        opStat.className = 'operation-stat';

        // Create horizontal row container for 4 columns
        const statsRow = document.createElement('div');
        statsRow.className = 'operation-stats-row';

        // Column 1: Operation name
        const nameItem = document.createElement('div');
        nameItem.className = 'operation-stat-item';
        const opName = document.createElement('div');
        opName.className = 'operation-name';
        opName.textContent = operation;
        nameItem.appendChild(opName);

        // Column 2: Accuracy
        const accuracy = ((stats.correct / stats.attempted) * 100).toFixed(1);
        const accuracyItem = document.createElement('div');
        accuracyItem.className = 'operation-stat-item';

        // Accuracy value
        const opAccuracy = document.createElement('div');
        opAccuracy.className = 'operation-accuracy';
        opAccuracy.textContent = `${accuracy}%`;

        // Color code based on accuracy
        if (accuracy >= 80) {
            opAccuracy.classList.add('excellent');
        } else if (accuracy >= 60) {
            opAccuracy.classList.add('good');
        } else {
            opAccuracy.classList.add('needs-work');
        }

        // Accuracy label
        const accuracyLabel = document.createElement('div');
        accuracyLabel.className = 'operation-detail-label';
        accuracyLabel.textContent = 'Accuracy';

        accuracyItem.appendChild(opAccuracy);
        accuracyItem.appendChild(accuracyLabel);

        // Column 3: Problems count
        const problemsItem = document.createElement('div');
        problemsItem.className = 'operation-stat-item';
        problemsItem.innerHTML = `
            <div class="operation-detail-value">${stats.attempted}</div>
            <div class="operation-detail-label">Problems</div>
        `;

        // Column 4: Average time
        const timeItem = document.createElement('div');
        timeItem.className = 'operation-stat-item';
        timeItem.innerHTML = `
            <div class="operation-detail-value">${stats.avgTime.toFixed(1)}s</div>
            <div class="operation-detail-label">Avg. Time</div>
        `;

        // Append all columns to the row
        statsRow.appendChild(nameItem);
        statsRow.appendChild(accuracyItem);
        statsRow.appendChild(problemsItem);
        statsRow.appendChild(timeItem);

        // Append row to the operation stat card
        opStat.appendChild(statsRow);
        operationsGrid.appendChild(opStat);
    });

    if (operationsGrid.children.length === 0) {
        operationsGrid.innerHTML = '<p class="empty-message">No operation data available yet. Start solving problems!</p>';
    }
}

/**
 * Render weak patterns
 */
function renderWeakPatterns() {
    const analysis = aiAgent.analyzePerformance();
    weakPatternsList.innerHTML = '';

    // Update badge count
    const badge = document.getElementById('weak-areas-badge');
    badge.textContent = analysis.weakPatterns.length;

    if (analysis.weakPatterns.length === 0) {
        weakPatternsList.innerHTML = '<p class="empty-message">No weak areas identified. Great job!</p>';
        return;
    }

    analysis.weakPatterns.slice(0, 5).forEach(pattern => {
        const patternItem = document.createElement('div');
        patternItem.className = 'pattern-item';

        const patternInfo = document.createElement('div');
        patternInfo.className = 'pattern-info';

        const description = document.createElement('div');
        description.className = 'pattern-description';
        description.textContent = pattern.description;

        const operation = document.createElement('div');
        operation.className = 'pattern-operation';
        operation.textContent = pattern.operation;

        patternInfo.appendChild(description);
        patternInfo.appendChild(operation);

        const patternStats = document.createElement('div');
        patternStats.className = 'pattern-stats';

        const accuracy = document.createElement('div');
        accuracy.className = 'pattern-accuracy weak';
        accuracy.textContent = `${pattern.accuracy}%`;

        const attempted = document.createElement('div');
        attempted.className = 'pattern-attempted';
        attempted.textContent = `${pattern.attempted} attempts`;

        patternStats.appendChild(accuracy);
        patternStats.appendChild(attempted);

        patternItem.appendChild(patternInfo);
        patternItem.appendChild(patternStats);
        weakPatternsList.appendChild(patternItem);
    });
}

/**
 * Render strengths
 */
function renderStrengths() {
    const analysis = aiAgent.analyzePerformance();
    strengthsList.innerHTML = '';

    // Get strong patterns count
    let strongPatternsCount = 0;
    Object.values(aiAgent.performanceData.operations).forEach(stats => {
        Object.values(stats.patterns).forEach(pattern => {
            if (pattern.attempted >= 3) {
                const accuracy = (pattern.correct / pattern.attempted) * 100;
                if (accuracy >= 80) {
                    strongPatternsCount++;
                }
            }
        });
    });

    // Update badge count
    const badge = document.getElementById('strengths-badge');
    badge.textContent = strongPatternsCount;

    if (analysis.strengths.length === 0) {
        strengthsList.innerHTML = '<p class="empty-message">Keep practicing to discover your strengths!</p>';
        return;
    }

    // Get strong patterns (accuracy >= 80%)
    const strongPatterns = [];
    Object.entries(aiAgent.performanceData.operations).forEach(([operation, stats]) => {
        Object.entries(stats.patterns).forEach(([patternKey, pattern]) => {
            if (pattern.attempted >= 3) {
                const accuracy = (pattern.correct / pattern.attempted) * 100;
                if (accuracy >= 80) {
                    strongPatterns.push({
                        operation,
                        pattern: patternKey,
                        description: pattern.description,
                        accuracy: accuracy.toFixed(1),
                        attempted: pattern.attempted
                    });
                }
            }
        });
    });

    if (strongPatterns.length === 0) {
        strengthsList.innerHTML = '<p class="empty-message">Keep practicing to discover your strengths!</p>';
        return;
    }

    strongPatterns.slice(0, 5).forEach(pattern => {
        const patternItem = document.createElement('div');
        patternItem.className = 'pattern-item';

        const patternInfo = document.createElement('div');
        patternInfo.className = 'pattern-info';

        const description = document.createElement('div');
        description.className = 'pattern-description';
        description.textContent = pattern.description;

        const operation = document.createElement('div');
        operation.className = 'pattern-operation';
        operation.textContent = pattern.operation;

        patternInfo.appendChild(description);
        patternInfo.appendChild(operation);

        const patternStats = document.createElement('div');
        patternStats.className = 'pattern-stats';

        const accuracy = document.createElement('div');
        accuracy.className = 'pattern-accuracy strong';
        accuracy.textContent = `${pattern.accuracy}%`;

        const attempted = document.createElement('div');
        attempted.className = 'pattern-attempted';
        attempted.textContent = `${pattern.attempted} attempts`;

        patternStats.appendChild(accuracy);
        patternStats.appendChild(attempted);

        patternItem.appendChild(patternInfo);
        patternItem.appendChild(patternStats);
        strengthsList.appendChild(patternItem);
    });
}

/**
 * Render performance timeline with progressive disclosure
 */
function renderRecentActivity() {
    recentActivity.innerHTML = '';

    const history = aiAgent.performanceData.sessionHistory;
    const problemCount = history.length;

    // Update badge count with session count
    const sessionCount = Math.floor(problemCount / 10);
    const badge = document.getElementById('activity-badge');
    badge.textContent = sessionCount;

    // Progressive disclosure based on data availability
    if (problemCount === 0) {
        renderEmptyState();
    } else if (problemCount < 10) {
        renderInProgressSession(history);
    } else if (problemCount < 20) {
        renderSingleSession(history);
    } else if (problemCount < 40) {
        renderEarlySessions(history);
    } else {
        renderFullTimeline(history);
    }
}

/**
 * State 1: No data - Motivational empty state
 */
function renderEmptyState() {
    recentActivity.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">📊</div>
            <h3 class="empty-state-title">Your Progress Timeline Awaits!</h3>
            <p class="empty-state-text">Complete your first quiz to unlock your personalized progress tracking and see how you improve over time.</p>
            <div class="empty-state-preview">
                <div class="preview-chart"></div>
                <div class="preview-sessions">
                    <div class="preview-session"></div>
                    <div class="preview-session"></div>
                    <div class="preview-session"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * State 2: 1-9 problems - Session in progress
 */
function renderInProgressSession(history) {
    const correct = history.filter(p => p.isCorrect).length;
    const totalTime = history.reduce((sum, p) => sum + p.timeTaken, 0);
    const avgTime = totalTime / history.length;
    const accuracy = (correct / history.length) * 100;

    recentActivity.innerHTML = `
        <div class="session-in-progress">
            <div class="progress-header">
                <h3>🎯 Session In Progress</h3>
                <div class="progress-count">${history.length}/10 problems</div>
            </div>
            <div class="progress-stats">
                <div class="progress-stat">
                    <div class="progress-stat-value ${accuracy >= 80 ? 'excellent' : accuracy >= 60 ? 'good' : 'needs-work'}">${correct}/${history.length}</div>
                    <div class="progress-stat-label">Correct</div>
                </div>
                <div class="progress-stat">
                    <div class="progress-stat-value">${accuracy.toFixed(0)}%</div>
                    <div class="progress-stat-label">Accuracy</div>
                </div>
                <div class="progress-stat">
                    <div class="progress-stat-value">${avgTime.toFixed(1)}s</div>
                    <div class="progress-stat-label">Avg. Time</div>
                </div>
            </div>
            <div class="progress-bar-wrapper">
                <div class="progress-bar-fill" style="width: ${(history.length / 10) * 100}%"></div>
            </div>
            <p class="progress-message">Complete ${10 - history.length} more problem${10 - history.length > 1 ? 's' : ''} to finish this session and unlock full analytics!</p>
        </div>
    `;
}

/**
 * State 3: 10-19 problems - Single complete session
 */
function renderSingleSession(history) {
    const sessionProblems = history.slice(0, 10);
    const correct = sessionProblems.filter(p => p.isCorrect).length;
    const totalTime = sessionProblems.reduce((sum, p) => sum + p.timeTaken, 0);
    const avgTime = totalTime / sessionProblems.length;
    const accuracy = (correct / sessionProblems.length) * 100;

    const accuracyClass = accuracy >= 80 ? 'excellent' : accuracy >= 60 ? 'good' : 'needs-work';

    recentActivity.innerHTML = `
        <div class="single-session">
            <h3>🎉 First Session Complete!</h3>
            <div class="session-summary">
                <div class="summary-stat">
                    <div class="summary-stat-icon">✓</div>
                    <div class="summary-stat-content">
                        <div class="summary-stat-value ${accuracyClass}">${correct}/10</div>
                        <div class="summary-stat-label">Correct Answers</div>
                    </div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-icon">📈</div>
                    <div class="summary-stat-content">
                        <div class="summary-stat-value ${accuracyClass}">${accuracy.toFixed(0)}%</div>
                        <div class="summary-stat-label">Accuracy</div>
                    </div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-icon">⏱️</div>
                    <div class="summary-stat-content">
                        <div class="summary-stat-value">${avgTime.toFixed(1)}s</div>
                        <div class="summary-stat-label">Avg. Time</div>
                    </div>
                </div>
            </div>
            <div class="motivation-message">
                <p>🌟 Great start! Complete more sessions to see your progress trends and track improvement over time.</p>
            </div>
        </div>
    `;
}

/**
 * State 4: 20-39 problems - Early sessions (2-3 sessions)
 */
function renderEarlySessions(history) {
    const sessions = groupIntoSessions(history);
    const recentSessions = sessions.slice(-3);

    const container = document.createElement('div');
    container.className = 'early-sessions';

    const header = document.createElement('div');
    header.className = 'sessions-header';
    header.innerHTML = `
        <h3>📊 Your Sessions</h3>
        <p class="sessions-subtitle">Complete more sessions to unlock trend charts!</p>
    `;
    container.appendChild(header);

    const sessionsList = document.createElement('div');
    sessionsList.className = 'sessions-list';

    recentSessions.reverse().forEach((session, index) => {
        const sessionCard = createSessionCard(session, recentSessions.length - index);
        sessionsList.appendChild(sessionCard);
    });

    container.appendChild(sessionsList);
    recentActivity.appendChild(container);
}

/**
 * State 5: 40+ problems - Full timeline with charts
 */
function renderFullTimeline(history) {
    const sessions = groupIntoSessions(history);
    const recentSessions = sessions.slice(-10);

    const container = document.createElement('div');
    container.className = 'timeline-container';

    // Add trend charts
    const chartsContainer = document.createElement('div');
    chartsContainer.className = 'charts-container';

    const accuracyChart = createMiniChart(recentSessions, 'accuracy', 'Accuracy Trend');
    const speedChart = createMiniChart(recentSessions, 'speed', 'Speed Trend');

    chartsContainer.appendChild(accuracyChart);
    chartsContainer.appendChild(speedChart);
    container.appendChild(chartsContainer);

    // Add sessions list
    const sessionsList = document.createElement('div');
    sessionsList.className = 'sessions-list';

    recentSessions.reverse().forEach((session, index) => {
        const sessionCard = createSessionCard(session, recentSessions.length - index);
        sessionsList.appendChild(sessionCard);
    });

    container.appendChild(sessionsList);
    recentActivity.appendChild(container);
}

/**
 * Group problems into 10-problem sessions
 */
function groupIntoSessions(history) {
    const sessions = [];
    for (let i = 0; i < history.length; i += 10) {
        const sessionProblems = history.slice(i, i + 10);
        if (sessionProblems.length < 10) continue; // Skip incomplete sessions

        const correct = sessionProblems.filter(p => p.isCorrect).length;
        const totalTime = sessionProblems.reduce((sum, p) => sum + p.timeTaken, 0);
        const avgTime = totalTime / sessionProblems.length;

        // Get operation breakdown
        const operationCounts = {};
        sessionProblems.forEach(p => {
            operationCounts[p.operation] = (operationCounts[p.operation] || 0) + 1;
        });
        const primaryOperation = Object.keys(operationCounts).sort((a, b) =>
            operationCounts[b] - operationCounts[a]
        )[0];

        sessions.push({
            index: sessions.length + 1,
            accuracy: (correct / sessionProblems.length) * 100,
            avgTime: avgTime,
            correct: correct,
            total: sessionProblems.length,
            operation: primaryOperation,
            timestamp: sessionProblems[sessionProblems.length - 1].timestamp || Date.now()
        });
    }
    return sessions;
}

/**
 * Create a session card UI element
 */
function createSessionCard(session, displayNumber) {
    const sessionItem = document.createElement('div');
    sessionItem.className = 'session-item';

    const accuracyClass = session.accuracy >= 80 ? 'excellent' : session.accuracy >= 60 ? 'good' : 'needs-work';

    sessionItem.innerHTML = `
        <div class="session-header">
            <div class="session-title">
                <span class="session-number">Session ${displayNumber}</span>
                <span class="session-operation ${session.operation}">${getOperationIcon(session.operation)}</span>
            </div>
            <div class="session-date">${formatSessionDate(session.timestamp)}</div>
        </div>
        <div class="session-stats">
            <div class="session-stat">
                <span class="session-stat-label">Score:</span>
                <span class="session-stat-value ${accuracyClass}">${session.correct}/${session.total}</span>
            </div>
            <div class="session-stat">
                <span class="session-stat-label">Accuracy:</span>
                <span class="session-stat-value ${accuracyClass}">${session.accuracy.toFixed(0)}%</span>
            </div>
            <div class="session-stat">
                <span class="session-stat-label">Avg. Time:</span>
                <span class="session-stat-value">${session.avgTime.toFixed(1)}s</span>
            </div>
        </div>
    `;

    return sessionItem;
}

/**
 * Create a mini line chart for visualizing trends
 */
function createMiniChart(sessions, metric, title) {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'mini-chart';

    const chartTitle = document.createElement('div');
    chartTitle.className = 'chart-title';
    chartTitle.textContent = title;

    const chartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chartSvg.setAttribute('class', 'chart-svg');
    chartSvg.setAttribute('viewBox', '0 0 300 80');
    chartSvg.setAttribute('preserveAspectRatio', 'none');

    const values = sessions.map(s => metric === 'accuracy' ? s.accuracy : s.avgTime);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    // Create path
    let pathData = '';
    const xStep = 300 / (sessions.length - 1 || 1);

    sessions.forEach((session, i) => {
        const value = metric === 'accuracy' ? session.accuracy : session.avgTime;
        const x = i * xStep;
        const y = 70 - ((value - minValue) / range) * 60;

        if (i === 0) {
            pathData = `M ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    });

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', `chart-line ${metric === 'accuracy' ? 'accuracy-line' : 'speed-line'}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');

    // Add dots for each data point
    sessions.forEach((session, i) => {
        const value = metric === 'accuracy' ? session.accuracy : session.avgTime;
        const x = i * xStep;
        const y = 70 - ((value - minValue) / range) * 60;

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        dot.setAttribute('r', '3');
        dot.setAttribute('class', `chart-dot ${metric === 'accuracy' ? 'accuracy-dot' : 'speed-dot'}`);

        chartSvg.appendChild(dot);
    });

    chartSvg.appendChild(path);
    chartContainer.appendChild(chartTitle);
    chartContainer.appendChild(chartSvg);

    return chartContainer;
}

/**
 * Get operation icon/emoji
 */
function getOperationIcon(operation) {
    const icons = {
        'addition': '+',
        'subtraction': '−',
        'multiplication': '×',
        'division': '÷'
    };
    return icons[operation] || '±';
}

/**
 * Format session timestamp to relative date
 */
function formatSessionDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Initialize on page load
initialize();
