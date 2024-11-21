// backend/app/static/js/charts.js

class MoodCharts {
  constructor() {
    this.charts = {
      weekly: null,
      emotion: null,
      activity: null,
    };
    this.initializeCharts();

    // Refresh charts periodically
    setInterval(() => this.updateCharts(), 300000); // Every 5 minutes
  }

  async initializeCharts() {
    try {
      const stats = await this.fetchMoodStats();
      if (stats) {
        this.createWeeklyChart(stats.recent_entries);
        this.createEmotionChart(stats.emotion_counts);
        this.createActivityChart(stats.activity_impact);
        this.updateLastEntryTime(stats.recent_entries[0]);
      }
    } catch (error) {
      console.error("Error initializing charts:", error);
    }
  }

  
  createWeeklyChart(entries = []) {
    const canvas = document.getElementById("weeklyMoodChart");
    if (!canvas) return;
    
    // Destroy existing chart if it exists
    if (this.charts.weekly) {
      this.charts.weekly.destroy();
    }
    
    if (!entries.length) {
      this.displayNoDataMessage(canvas, "No mood entries available");
      return;
    }
    
    const ctx = canvas.getContext("2d");
    const data = entries.map((entry) => ({
      x: new Date(entry.timestamp).getTime(), // Convert to timestamp
      y: entry.mood_score,
    }));
    
    this.charts.weekly = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Mood Score",
            data: data,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const entry = entries[context.dataIndex];
                return [
                  `Mood: ${entry.mood_score}`,
                  `Activities: ${entry.activities?.join(", ") || "None"}`,
                  `Emotions: ${entry.emotions?.join(", ") || "None"}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: "MMM d",
              },
              tooltipFormat: "PPP",
            },
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            min: 1,
            max: 10,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: "Mood Score",
            },
          },
        },
      },
    });
  }
  
  createEmotionChart(emotionCounts = {}) {
    const canvas = document.getElementById("emotionChart");
    if (!canvas) return;
    
    if (this.charts.emotion) {
      this.charts.emotion.destroy();
    }
    
    const ctx = canvas.getContext("2d");
    const emotions = Object.keys(emotionCounts);
    const counts = Object.values(emotionCounts);
    const colors = [
      "#60A5FA",
      "#34D399",
      "#FBBF24",
      "#F87171",
      "#A78BFA",
      "#EC4899",
      "#6EE7B7",
      "#FCD34D",
    ];
    
    this.charts.emotion = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: emotions,
        datasets: [
          {
            data: counts,
            backgroundColor: colors.slice(0, emotions.length),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 20,
            },
          },
        },
      },
    });
  }
  
  createActivityChart(activityImpact = {}) {
    const canvas = document.getElementById("activityImpactChart");
    if (!canvas) return;
    
    if (this.charts.activity) {
      this.charts.activity.destroy();
    }
    
    const ctx = canvas.getContext("2d");
    const activities = Object.keys(activityImpact);
    const impacts = Object.values(activityImpact);
    
    this.charts.activity = new Chart(ctx, {
      type: "bar",
      data: {
        labels: activities,
        datasets: [
          {
            label: "Average Mood",
            data: impacts,
            backgroundColor: "rgb(34, 197, 94)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: "Average Mood Score",
            },
          },
        },
      },
    });
  }
  
  updateLastEntryTime(entry) {
    const lastEntryElement = document.getElementById("lastEntryTime");
    if (lastEntryElement && entry) {
      const date = new Date(entry.timestamp);
      lastEntryElement.textContent = date.toLocaleString();
    }
  }
  
  displayNoDataMessage(canvas, message) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#6B7280";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  }
  
  async updateCharts() {
    const stats = await this.fetchMoodStats();
    if (stats) {
      this.createWeeklyChart(stats.recent_entries);
      this.createEmotionChart(stats.emotion_counts);
      this.createActivityChart(stats.activity_impact);
      this.updateLastEntryTime(stats.recent_entries[0]);
    }
  }
  
  async fetchMoodStats() {
    try {
      const response = await fetch("/api/v1/mood/stats", {
        credentials: "include",
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error("Failed to fetch mood stats");
    } catch (error) {
      console.error("Error fetching mood stats:", error);
      return null;
    }
  }
}

// Initialize charts when document is ready
document.addEventListener("DOMContentLoaded", () => {
  window.moodCharts = new MoodCharts();
});
