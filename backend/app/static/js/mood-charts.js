// backend/app/static/js/mood-charts.js

class MoodCharts {
    constructor() {
        this.charts = {
            weekly: null,
            emotion: null,
            activity: null
        };
        this.initializeCharts();
    }

    async initializeCharts() {
        try {
            const stats = await this.fetchMoodStats();
            if (stats) {
                this.createWeeklyChart(stats);
                this.createEmotionChart(stats);
                this.createActivityChart(stats);
            }
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    async fetchMoodStats() {
        try {
            const response = await fetch('/api/v1/mood/stats', {
                credentials: 'include'
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching mood stats:', error);
            return null;
        }
    }

    createWeeklyChart(stats) {
        const ctx = document.getElementById('weeklyMoodChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.weekly) {
            this.charts.weekly.destroy();
        }

        this.charts.weekly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: stats.recent_entries.map(entry => 
                    new Date(entry.timestamp).toLocaleDateString()
                ),
                datasets: [{
                    label: 'Mood Score',
                    data: stats.recent_entries.map(entry => entry.mood_score),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const entry = stats.recent_entries[context.dataIndex];
                                return [
                                    `Mood: ${entry.mood_score}`,
                                    `Activities: ${entry.activities.join(', ')}`,
                                    `Emotions: ${entry.emotions.join(', ')}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        min: 1,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Mood Score'
                        }
                    }
                }
            }
        });
    }

    createEmotionChart(stats) {
        const ctx = document.getElementById('emotionChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.emotion) {
            this.charts.emotion.destroy();
        }

        const emotions = Object.keys(stats.emotion_counts);
        const counts = Object.values(stats.emotion_counts);

        this.charts.emotion = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: emotions,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        '#60A5FA', '#34D399', '#FBBF24', '#F87171',
                        '#A78BFA', '#EC4899', '#6EE7B7', '#FCD34D'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    createActivityChart(stats) {
        const ctx = document.getElementById('activityImpactChart')?.getContext('2d');
        if (!ctx) return;

        if (this.charts.activity) {
            this.charts.activity.destroy();
        }

        const activities = Object.keys(stats.activity_impact);
        const impacts = Object.values(stats.activity_impact);

        this.charts.activity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: activities,
                datasets: [{
                    label: 'Average Mood',
                    data: impacts,
                    backgroundColor: 'rgb(34, 197, 94)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Average Mood Score'
                        }
                    }
                }
            }
        });
    }

    async updateCharts() {
        const stats = await this.fetchMoodStats();
        if (stats) {
            this.createWeeklyChart(stats);
            this.createEmotionChart(stats);
            this.createActivityChart(stats);
        }
    }
}

// Initialize charts when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.moodCharts = new MoodCharts();
});