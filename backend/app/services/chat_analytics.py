# backend/app/services/chat_analytics.py
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from collections import Counter
import logging

logger = logging.getLogger(__name__)

class ChatAnalytics:
    def __init__(self, db):
        self.db = db

    async def analyze_user_interactions(
        self, user_id: str, days: int = 30
    ) -> Dict:
        """Analyze user's chat interactions."""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get user's messages
            messages = await self.db["messages"].find({
                "user_id": user_id,
                "timestamp": {"$gte": start_date}
            }).to_list(None)
            
            # Analyze patterns
            return {
                "message_count": len(messages),
                "interaction_patterns": await self._analyze_patterns(messages),
                "emotional_trends": await self._analyze_emotions(messages),
                "support_group_engagement": await self._analyze_group_engagement(user_id),
                "crisis_incidents": await self._analyze_crisis_incidents(messages),
                "improvement_metrics": await self._calculate_improvement_metrics(user_id)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing chat interactions: {str(e)}")
            return {}

    async def _analyze_patterns(self, messages: List[Dict]) -> Dict:
        """Analyze message patterns."""
        time_of_day = Counter()
        message_types = Counter()
        
        for msg in messages:
            hour = msg["timestamp"].hour
            time_category = (
                "morning" if 5 <= hour < 12
                else "afternoon" if 12 <= hour < 17
                else "evening" if 17 <= hour < 22
                else "night"
            )
            time_of_day[time_category] += 1
            message_types[msg.get("message_type", "general")] += 1
            
        return {
            "peak_activity_times": dict(time_of_day),
            "message_type_distribution": dict(message_types)
        }

    async def _analyze_emotions(self, messages: List[Dict]) -> Dict:
        """Analyze emotional content of messages."""
        emotions = Counter()
        sentiment_scores = []
        
        for msg in messages:
            if msg.get("ai_analysis"):
                emotions.update(msg["ai_analysis"].get("emotions", []))
                if "sentiment_score" in msg["ai_analysis"]:
                    sentiment_scores.append(msg["ai_analysis"]["sentiment_score"])
        
        return {
            "common_emotions": dict(emotions.most_common(5)),
            "average_sentiment": sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
        }

    async def _analyze_group_engagement(self, user_id: str) -> Dict:
        """Analyze support group engagement."""
        memberships = await self.db["group_memberships"].find({
            "user_id": user_id,
            "is_active": True
        }).to_list(None)
        
        engagement = {}
        for membership in memberships:
            group_id = membership["group_id"]
            shares = await self.db["group_shares"].count_documents({
                "group_id": group_id,