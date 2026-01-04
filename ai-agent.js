/**
 * AI Agent for Pi - Practice Intelligence
 * Monitors user progress and designs personalized problems
 * Author: Kumar Srinivasan
 */

class PiAIAgent {
    constructor() {
        // Performance tracking structure
        this.performanceData = {
            operations: {
                addition: { attempted: 0, correct: 0, avgTime: 0, patterns: {} },
                subtraction: { attempted: 0, correct: 0, avgTime: 0, patterns: {} },
                multiplication: { attempted: 0, correct: 0, avgTime: 0, patterns: {} },
                division: { attempted: 0, correct: 0, avgTime: 0, patterns: {} }
            },
            problemPatterns: {},
            sessionHistory: [],
            weakAreas: [],
            strengths: [],
            lastAnalysis: null
        };

        // Claude API configuration (optional)
        this.apiKey = null;
        this.apiEnabled = false;
    }

    /**
     * Initialize AI agent with user profile data
     */
    initialize(profileData) {
        // Load existing performance data from profile
        if (profileData && profileData.aiAnalytics) {
            this.performanceData = { ...this.performanceData, ...profileData.aiAnalytics };
        }

        // Check for API key
        const savedApiKey = localStorage.getItem('pi_claude_api_key');
        if (savedApiKey) {
            this.apiKey = savedApiKey;
            this.apiEnabled = true;
        }
    }

    /**
     * Track a problem attempt
     */
    trackAttempt(problemData, isCorrect, timeTaken) {
        const { operation, num1, num2, answer } = problemData;

        // Update operation stats
        const opStats = this.performanceData.operations[operation];
        if (opStats) {
            opStats.attempted++;
            if (isCorrect) opStats.correct++;

            // Update average time
            opStats.avgTime = ((opStats.avgTime * (opStats.attempted - 1)) + timeTaken) / opStats.attempted;

            // Track problem patterns
            this.trackPattern(operation, num1, num2, answer, isCorrect, timeTaken);
        }

        // Add to session history
        this.performanceData.sessionHistory.push({
            timestamp: new Date().toISOString(),
            operation,
            problem: `${num1} ${this.getOperationSymbol(operation)} ${num2}`,
            isCorrect,
            timeTaken,
            answer
        });

        // Keep only last 100 attempts
        if (this.performanceData.sessionHistory.length > 100) {
            this.performanceData.sessionHistory = this.performanceData.sessionHistory.slice(-100);
        }
    }

    /**
     * Track specific problem patterns
     */
    trackPattern(operation, num1, num2, answer, isCorrect, timeTaken) {
        const patterns = this.performanceData.operations[operation].patterns;

        // Identify pattern category
        let patternKey = this.identifyPattern(operation, num1, num2, answer);

        if (!patterns[patternKey]) {
            patterns[patternKey] = {
                attempted: 0,
                correct: 0,
                avgTime: 0,
                description: this.getPatternDescription(patternKey, operation)
            };
        }

        const pattern = patterns[patternKey];
        pattern.attempted++;
        if (isCorrect) pattern.correct++;
        pattern.avgTime = ((pattern.avgTime * (pattern.attempted - 1)) + timeTaken) / pattern.attempted;
    }

    /**
     * Identify problem pattern category
     */
    identifyPattern(operation, num1, num2, answer) {
        switch(operation) {
            case 'addition':
                if (num1 + num2 >= 100) return 'large_sums';
                if ((num1 % 10) + (num2 % 10) >= 10) return 'carrying';
                if (num1 < 10 && num2 < 10) return 'single_digit';
                return 'basic_addition';

            case 'subtraction':
                if (num1 < num2) return 'negative_result';
                if (num1 >= 100) return 'large_numbers';
                if ((num1 % 10) < (num2 % 10)) return 'borrowing';
                if (num2 < 10) return 'subtract_small';
                return 'basic_subtraction';

            case 'multiplication':
                if (num1 === 0 || num2 === 0) return 'multiply_by_zero';
                if (num1 === 1 || num2 === 1) return 'multiply_by_one';
                if (num1 <= 10 && num2 <= 10) return 'times_tables';
                if (num1 > 12 || num2 > 12) return 'large_multiplication';
                return 'basic_multiplication';

            case 'division':
                if (answer % 1 !== 0) return 'division_with_remainder';
                if (num2 === 1) return 'divide_by_one';
                if (num1 === num2) return 'divide_same_number';
                if (num1 < num2) return 'fraction_result';
                if (num1 >= 100) return 'large_division';
                return 'basic_division';

            default:
                return 'unknown';
        }
    }

    /**
     * Get human-readable pattern description
     */
    getPatternDescription(patternKey, operation) {
        const descriptions = {
            // Addition patterns
            'large_sums': 'Addition with sums ≥ 100',
            'carrying': 'Addition requiring carrying',
            'single_digit': 'Single-digit addition',
            'basic_addition': 'Basic two-digit addition',

            // Subtraction patterns
            'negative_result': 'Subtraction with negative results',
            'large_numbers': 'Subtraction with large numbers (≥100)',
            'borrowing': 'Subtraction requiring borrowing',
            'subtract_small': 'Subtracting single digits',
            'basic_subtraction': 'Basic two-digit subtraction',

            // Multiplication patterns
            'multiply_by_zero': 'Multiplication by zero',
            'multiply_by_one': 'Multiplication by one',
            'times_tables': 'Times tables (up to 10×10)',
            'large_multiplication': 'Multiplication beyond 12',
            'basic_multiplication': 'Basic multiplication',

            // Division patterns
            'division_with_remainder': 'Division with remainders',
            'divide_by_one': 'Division by one',
            'divide_same_number': 'Dividing number by itself',
            'fraction_result': 'Division resulting in fractions',
            'large_division': 'Division with large numbers',
            'basic_division': 'Basic division'
        };

        return descriptions[patternKey] || patternKey.replace(/_/g, ' ');
    }

    /**
     * Get operation symbol for display
     */
    getOperationSymbol(operation) {
        const symbols = {
            'addition': '+',
            'subtraction': '−',
            'multiplication': '×',
            'division': '÷'
        };
        return symbols[operation] || '?';
    }

    /**
     * Analyze performance and identify weak areas
     */
    analyzePerformance() {
        const analysis = {
            weakOperations: [],
            weakPatterns: [],
            strengths: [],
            recommendations: [],
            overallAccuracy: 0,
            timestamp: new Date().toISOString()
        };

        let totalAttempted = 0;
        let totalCorrect = 0;

        // Analyze each operation
        Object.entries(this.performanceData.operations).forEach(([operation, stats]) => {
            if (stats.attempted > 0) {
                const accuracy = (stats.correct / stats.attempted) * 100;
                totalAttempted += stats.attempted;
                totalCorrect += stats.correct;

                if (accuracy < 60 && stats.attempted >= 5) {
                    analysis.weakOperations.push({
                        operation,
                        accuracy: accuracy.toFixed(1),
                        attempted: stats.attempted,
                        avgTime: stats.avgTime.toFixed(1)
                    });
                } else if (accuracy >= 80 && stats.attempted >= 5) {
                    analysis.strengths.push({
                        operation,
                        accuracy: accuracy.toFixed(1),
                        attempted: stats.attempted
                    });
                }

                // Analyze patterns within operation
                Object.entries(stats.patterns).forEach(([patternKey, pattern]) => {
                    if (pattern.attempted >= 3) {
                        const patternAccuracy = (pattern.correct / pattern.attempted) * 100;
                        if (patternAccuracy < 60) {
                            analysis.weakPatterns.push({
                                operation,
                                pattern: patternKey,
                                description: pattern.description,
                                accuracy: patternAccuracy.toFixed(1),
                                attempted: pattern.attempted
                            });
                        }
                    }
                });
            }
        });

        analysis.overallAccuracy = totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(1) : 0;

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);

        // Store analysis
        this.performanceData.lastAnalysis = analysis;
        this.performanceData.weakAreas = analysis.weakOperations.map(w => w.operation);
        this.performanceData.strengths = analysis.strengths.map(s => s.operation);

        return analysis;
    }

    /**
     * Generate personalized recommendations
     */
    generateRecommendations(analysis) {
        const recommendations = [];

        // Weak operations
        if (analysis.weakOperations.length > 0) {
            const weakOp = analysis.weakOperations[0];
            recommendations.push({
                type: 'practice',
                priority: 'high',
                title: `Focus on ${this.capitalizeOperation(weakOp.operation)}`,
                description: `Your ${weakOp.operation} accuracy is ${weakOp.accuracy}%. Try practicing with the ${this.capitalizeOperation(weakOp.operation)} operation mode.`,
                action: `Practice ${weakOp.operation}`
            });
        }

        // Weak patterns
        if (analysis.weakPatterns.length > 0) {
            const weakPattern = analysis.weakPatterns[0];
            recommendations.push({
                type: 'technique',
                priority: 'medium',
                title: `Improve: ${weakPattern.description}`,
                description: `You've attempted ${weakPattern.attempted} problems with ${weakPattern.accuracy}% accuracy. Focus on mastering this pattern.`,
                action: 'Practice specific pattern'
            });
        }

        // Strengths
        if (analysis.strengths.length > 0) {
            const strength = analysis.strengths[0];
            recommendations.push({
                type: 'achievement',
                priority: 'low',
                title: `Strong in ${this.capitalizeOperation(strength.operation)}!`,
                description: `You're excelling at ${strength.operation} with ${strength.accuracy}% accuracy. Keep up the great work!`,
                action: 'Continue practicing'
            });
        }

        // Overall performance
        if (parseFloat(analysis.overallAccuracy) >= 80) {
            recommendations.push({
                type: 'challenge',
                priority: 'low',
                title: 'Ready for a Challenge?',
                description: `With ${analysis.overallAccuracy}% overall accuracy, consider trying Mixed mode or advancing to the next grade level.`,
                action: 'Try harder problems'
            });
        } else if (parseFloat(analysis.overallAccuracy) < 50) {
            recommendations.push({
                type: 'support',
                priority: 'high',
                title: 'Take Your Time',
                description: 'Focus on accuracy over speed. Review your mistakes and practice problem patterns that challenge you.',
                action: 'Review basics'
            });
        }

        // Time-based recommendations
        const avgTimeTaken = this.getAverageResponseTime();
        if (avgTimeTaken > 0 && avgTimeTaken < 5) {
            recommendations.push({
                type: 'strategy',
                priority: 'low',
                title: 'Great Speed!',
                description: `Your average response time is ${avgTimeTaken.toFixed(1)}s. You're thinking fast and accurately.`,
                action: 'Maintain pace'
            });
        } else if (avgTimeTaken > 20) {
            recommendations.push({
                type: 'strategy',
                priority: 'medium',
                title: 'Build Speed Gradually',
                description: `Your average time is ${avgTimeTaken.toFixed(1)}s. Focus on recognizing patterns to improve speed naturally.`,
                action: 'Practice for speed'
            });
        }

        return recommendations;
    }

    /**
     * Get average response time across all operations
     */
    getAverageResponseTime() {
        let totalTime = 0;
        let count = 0;

        Object.values(this.performanceData.operations).forEach(stats => {
            if (stats.attempted > 0) {
                totalTime += stats.avgTime * stats.attempted;
                count += stats.attempted;
            }
        });

        return count > 0 ? totalTime / count : 0;
    }

    /**
     * Capitalize operation name
     */
    capitalizeOperation(operation) {
        return operation.charAt(0).toUpperCase() + operation.slice(1);
    }

    /**
     * Generate AI-enhanced insights using Claude API (optional)
     */
    async generateAIInsights() {
        if (!this.apiEnabled || !this.apiKey) {
            return null;
        }

        try {
            const analysis = this.performanceData.lastAnalysis || this.analyzePerformance();
            const recentHistory = this.performanceData.sessionHistory.slice(-20);

            const prompt = `You are an AI math tutor analyzing a student's performance in the Pi math game.

Recent Performance Data:
- Overall Accuracy: ${analysis.overallAccuracy}%
- Weak Operations: ${analysis.weakOperations.map(w => `${w.operation} (${w.accuracy}%)`).join(', ') || 'None'}
- Strong Operations: ${analysis.strengths.map(s => `${s.operation} (${s.accuracy}%)`).join(', ') || 'None'}
- Weak Patterns: ${analysis.weakPatterns.map(p => p.description).join(', ') || 'None'}

Recent Problems (last 20):
${recentHistory.map((h, i) => `${i + 1}. ${h.problem} = ${h.answer} (${h.isCorrect ? '✓' : '✗'}, ${h.timeTaken.toFixed(1)}s)`).join('\n')}

Please provide:
1. A brief encouraging assessment (2-3 sentences)
2. One specific learning insight or pattern you notice
3. One actionable tip to improve performance

Keep it friendly, encouraging, and suitable for children aged 6-16.`;

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 500,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                })
            });

            if (!response.ok) {
                console.error('AI API request failed:', response.status);
                return null;
            }

            const data = await response.json();
            return data.content[0].text;

        } catch (error) {
            console.error('Error generating AI insights:', error);
            return null;
        }
    }

    /**
     * Get personalized problem parameters
     */
    getAdaptiveProblemSuggestion(currentGrade, currentOperation) {
        const analysis = this.performanceData.lastAnalysis || this.analyzePerformance();

        // Determine which operation to focus on
        let suggestedOperation = currentOperation;

        if (currentOperation === 'mixed') {
            // If in mixed mode, bias towards weak operations
            if (analysis.weakOperations.length > 0) {
                const weakOp = analysis.weakOperations[0].operation;
                // 60% chance to practice weak operation, 40% mixed
                suggestedOperation = Math.random() < 0.6 ? weakOp : currentOperation;
            }
        }

        return {
            operation: suggestedOperation,
            focusPatterns: analysis.weakPatterns.filter(p => p.operation === suggestedOperation).map(p => p.pattern),
            difficulty: this.recommendDifficulty(analysis, suggestedOperation)
        };
    }

    /**
     * Recommend difficulty level based on performance
     */
    recommendDifficulty(analysis, operation) {
        const opStats = this.performanceData.operations[operation];

        if (!opStats || opStats.attempted < 5) {
            return 'medium'; // Default
        }

        const accuracy = (opStats.correct / opStats.attempted) * 100;

        if (accuracy >= 85) return 'hard';
        if (accuracy >= 70) return 'medium';
        return 'easy';
    }

    /**
     * Save AI analytics data to profile
     */
    saveToProfile() {
        return {
            aiAnalytics: this.performanceData
        };
    }

    /**
     * Set Claude API key
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        this.apiEnabled = !!apiKey;
        if (apiKey) {
            localStorage.setItem('pi_claude_api_key', apiKey);
        } else {
            localStorage.removeItem('pi_claude_api_key');
        }
    }

    /**
     * Get current API status
     */
    getApiStatus() {
        return {
            enabled: this.apiEnabled,
            hasKey: !!this.apiKey
        };
    }
}

// Export for use in main script
window.PiAIAgent = PiAIAgent;
