// backend/app/static/js/mood-tracking.js

class MoodTracker {
    constructor() {
        this.selectedEmotions = new Set();
        this.selectedActivities = new Set();
        this.moodEmojis = {
            1: '😢', 2: '😔', 3: '😕', 4: '😐',
            5: '😊', 6: '😃', 7: '😄', 8: '😁',
            9: '🤗', 10: '🥳'
        };
        this.initializeForm();
        this.initializeInsights();
    }

    initializeForm() {
        // Initialize mood form
        const form = document.getElementById('moodForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Initialize mood score slider
        const moodScore = document.getElementById('moodScore');
        if (moodScore) {
            moodScore.addEventListener('input', (e) => this.updateMoodEmoji(e.target.value));
        }

        // Initialize emotion buttons
        document.querySelectorAll('.emotion-btn').forEach(button => {
            button.addEventListener('click', () => this.toggleEmotion(button));
        });

        // Initialize activity buttons
        document.querySelectorAll('.activity-btn').forEach(button => {
            button.addEventListener('click', () => this.toggleActivity(button));
        });
    }

    initializeInsights() {
        const refreshButton = document.getElementById('refreshInsights');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.refreshInsights());
        }
        this.refreshInsights();
    }

    updateMoodEmoji(score) {
        document.getElementById('moodScoreValue').textContent = score;
        document.getElementById('moodEmoji').textContent = this.moodEmojis[score] || '😊';
    }

    toggleEmotion(button) {
        const emotion = button.dataset.emotion;
        button.classList.toggle('bg-blue-500');
        button.classList.toggle('text-white');
        button.classList.toggle('bg-gray-200');
        button.classList.toggle('text-gray-700');
        
        if (this.selectedEmotions.has(emotion)) {
            this.selectedEmotions.delete(emotion);
        } else {
            this.selectedEmotions.add(emotion);
        }
    }

    toggleActivity(button) {
        const activity = button.dataset.activity;
        button.classList.toggle('bg-green-500');
        button.classList.toggle('text-white');
        button.classList.toggle('bg-gray-200');
        button.classList.toggle('text-gray-700');
        
        if (this.selectedActivities.has(activity)) {
            this.selectedActivities.delete(activity);
        } else {
            this.selectedActivities.add(activity);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            mood_score: parseInt(document.getElementById('moodScore').value),
            mood_description: document.getElementById('moodDescription').value,
            emotions: Array.from(this.selectedEmotions),
            activities: Array.from(this.selectedActivities)
        };

        try {
            const response = await fetch('/api/v1/mood/entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok) {
                this.showNotification('Mood entry saved successfully!', 'success');
                this.resetForm();
                if (window.moodCharts) {
                    await window.moodCharts.updateCharts();
                }
                await this.refreshInsights();
            } else {
                const error = await response.json();
                this.showNotification(error.detail || 'Failed to save mood entry', 'error');
            }
        } catch (error) {
            console.error('Error saving mood entry:', error);
            this.showNotification('An error occurred while saving your mood entry', 'error');
        }
    }

    resetForm() {
        document.getElementById('moodForm').reset();
        this.selectedEmotions.clear();
        this.selectedActivities.clear();
        
        document.querySelectorAll('.emotion-btn, .activity-btn').forEach(btn => {
            btn.classList.remove('bg-blue-500', 'bg-green-500', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });

        this.updateMoodEmoji(5);
    }

    async refreshInsights() {
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
        const patternsContainer = document.getElementById('moodPatterns');
        const suggestionsContainer = document.getElementById('moodSuggestions');

        if (patternsContainer) {
            patternsContainer.innerHTML = insights.patterns.map(pattern => `
                <div class="flex items-start space-x-2">
                    <span class="text-blue-500">📊</span>
                    <p class="text-sm text-gray-600">${pattern}</p>
                </div>
            `).join('');
        }

        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = insights.suggestions.map(suggestion => `
                <div class="flex items-start space-x-2">
                    <span class="text-green-500">💡</span>
                    <p class="text-sm text-gray-600">${suggestion}</p>
                </div>
            `).join('');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize mood tracker when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.moodTracker = new MoodTracker();
});