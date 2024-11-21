// backend/app/static/js/mood-insights.js

class MoodInsights {
    constructor() {
        this.initializeInsights();
    }

    async initializeInsights() {
        await this.loadInsights();
        this.setupRefreshButton();
    }

    setupRefreshButton() {
        const refreshBtn = document.querySelector('[data-action="refresh-insights"]');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadInsights());
        }
    }

    async loadInsights() {
        try {
            const response = await fetch('/api/v1/mood/insights', {
                credentials: 'include'
            });

            if (response.ok) {
                const insights = await response.json();
                this.updateInsightsDisplay(insights);
            }
        } catch (error) {
            console.error('Error loading insights:', error);
        }
    }

    updateInsightsDisplay(insights) {
        // Update Patterns
        const patternsContainer = document.getElementById('moodPatterns');
        if (patternsContainer) {
            patternsContainer.innerHTML = insights.patterns.map(pattern => `
                <div class="flex items-start space-x-2">
                    <span class="text-blue-500">📊</span>
                    <p class="text-sm text-gray-600">${pattern}</p>
                </div>
            `).join('');
        }

        // Update Suggestions
        const suggestionsContainer = document.getElementById('moodSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = insights.suggestions.map(suggestion => `
                <div class="flex items-start space-x-2">
                    <span class="text-green-500">💡</span>
                    <p class="text-sm text-gray-600">${suggestion}</p>
                </div>
            `).join('');
        }
    }
}

// Initialize insights when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.moodInsights = new MoodInsights();
});