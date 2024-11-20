# backend/app/services/analytics_service.py

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from ..db.mongodb import get_database
from bson import ObjectId

class AnalyticsService:
    async def get_user_analytics(self, user_id: str, time_period: str = "week") -> Dict:
        """
        Get comprehensive analytics for a specific user
        
        Args:
            user_id: User's MongoDB ID
            time_period: Analysis period ("day", "week", "month")
            
        Returns:
            Dictionary containing user analytics data
        """
        # Get database connection
        db = await get_database()
        
        # Convert string ID to MongoDB ObjectId
        user_object_id = ObjectId(user_id)
        
        # Calculate date range for analysis
        end_date = datetime.utcnow()
        if time_period == "week":
            start_date = end_date - timedelta(days=7)
        elif time_period == "month":
            start_date = end_date - timedelta(days=30)
        else:
            start_date = end_date - timedelta(days=1)

        try:
            # Fetch user's messages within time period
            messages = await db["messages"].find({
                "user_id": user_object_id,
                "timestamp": {"$gte": start_date, "$lte": end_date}
            }).to_list(length=None)

            # Fetch user's active group memberships
            memberships = await db["group_memberships"].find({
                "user_id": user_object_id,
                "is_active": True
            }).to_list(length=None)

            # Calculate message distribution by hour
            hour_distribution = [0] * 24
            for msg in messages:
                timestamp = msg.get('timestamp')
                if timestamp:
                    hour = timestamp.hour
                    hour_distribution[hour] += 1

            # Compile and return analytics
            return {
                "total_interactions": len(messages),
                "support_groups_joined": len(memberships),
                "interaction_times": {
                    "hour_distribution": hour_distribution
                },
                "average_mood": await self.calculate_average_mood(user_id, start_date),
                "mood_distribution": await self.get_mood_distribution(user_id, start_date)
            }
        except Exception as e:
            # Return default values on error
            print(f"Error getting analytics: {str(e)}")
            return {
                "total_interactions": 0,
                "support_groups_joined": 0,
                "interaction_times": {
                    "hour_distribution": [0] * 24
                },
                "average_mood": 0,
                "mood_distribution": [0, 0, 0, 0, 0]
            }

    async def get_mood_distribution(self, user_id: str, start_date: datetime) -> List[int]:
        """
        Calculate distribution of mood scores in ranges
        
        Args:
            user_id: User's MongoDB ID
            start_date: Start date for analysis
            
        Returns:
            List of counts for mood score ranges [1-2, 3-4, 5-6, 7-8, 9-10]
        """
        db = await get_database()
        distribution = [0] * 5  # Five ranges: 1-2, 3-4, 5-6, 7-8, 9-10
        
        try:
            # Fetch mood entries within time period
            entries = await db["mood_entries"].find({
                "user_id": ObjectId(user_id),
                "timestamp": {"$gte": start_date}
            }).to_list(length=None)
            
            # Calculate distribution
            for entry in entries:
                score = entry.get('mood_score', 0)
                if 1 <= score <= 10:
                    index = (score - 1) // 2
                    distribution[index] += 1
                    
            return distribution
        except Exception as e:
            print(f"Error getting mood distribution: {str(e)}")
            return [0, 0, 0, 0, 0]

    # ... [Additional method documentation continues]

    async def get_mood_entries(self, user_id: str, days: int = 7) -> List[Dict]:
        """Get mood entries for the specified number of days."""
        db = await get_database()
        start_date = datetime.utcnow() - timedelta(days=days)
        
        try:
            entries = await db["mood_entries"].find({
                "user_id": ObjectId(user_id),
                "timestamp": {"$gte": start_date}
            }).sort("timestamp", 1).to_list(length=None)
            
            return entries
        except Exception as e:
            print(f"Error getting mood entries: {str(e)}")
            return []

    async def calculate_average_mood(self, user_id: str, start_date: datetime) -> float:
        """Calculate average mood score for the period."""
        db = await get_database()
        
        try:
            entries = await db["mood_entries"].find({
                "user_id": ObjectId(user_id),
                "timestamp": {"$gte": start_date}
            }).to_list(length=None)
            
            if not entries:
                return 0.0
                
            total_score = sum(entry.get('mood_score', 0) for entry in entries)
            return total_score / len(entries)
        except Exception as e:
            print(f"Error calculating average mood: {str(e)}")
            return 0.0
    
    def _analyze_interaction_times(self, messages: List[Dict]) -> Dict:
        """Analyze when the user typically interacts."""
        hour_counts = [0] * 24
        for msg in messages:
            hour = msg["timestamp"].hour
            hour_counts[hour] += 1
        
        return {
            "peak_hours": [i for i, count in enumerate(hour_counts) 
                          if count == max(hour_counts)],
            "hour_distribution": hour_counts
        }
    
    def _get_most_active_days(self, messages: List[Dict]) -> List[str]:
        """Get the days with most activity."""
        day_counts = {}
        for msg in messages:
            day = msg["timestamp"].strftime("%A")
            day_counts[day] = day_counts.get(day, 0) + 1
        
        sorted_days = sorted(day_counts.items(), key=lambda x: x[1], reverse=True)
        return [day for day, _ in sorted_days[:3]]
    
    def _calculate_completion_rate(self, messages: List[Dict]) -> float:
        """Calculate the rate of completed conversations."""
        checkins = [msg for msg in messages if msg.get("message_type") == "check_in"]
        if not checkins:
            return 0.0
        
        completed = sum(1 for msg in checkins if msg.get("completed", False))
        return (completed / len(checkins)) * 100 if checkins else 0.0