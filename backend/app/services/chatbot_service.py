# backend/app/services/chatbot_service.py
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import logging
import random

logger = logging.getLogger(__name__)

class ChatbotService:
    def __init__(self):
        self._init_conversation_patterns()
        self._init_support_groups()
        self._init_coping_strategies()

    def _init_conversation_patterns(self):
        self.daily_checkin_questions = [
            "How are you feeling today? (1-10)",
            "How well did you sleep last night? (1-10)",
            "What's your anxiety level right now? (1-10)",
            "Have you taken your medications today? (if applicable)",
            "What's one thing you're looking forward to today?",
            "Have you experienced any triggers today?",
            "Would you like to talk about anything specific?"
        ]
        
        self.crisis_keywords = [
            "suicide", "kill", "die", "end it", "hopeless",
            "can't go on", "worthless", "better off dead"
        ]

        self.emotional_patterns = {
            "anger": ["angry", "furious", "mad", "rage", "frustrated"],
            "anxiety": ["anxious", "worried", "nervous", "stressed", "panic"],
            "depression": ["sad", "depressed", "hopeless", "empty", "worthless"],
            "positive": ["happy", "grateful", "excited", "peaceful", "confident"]
        }

    def _init_support_groups(self):
        self.support_groups = {
            "CGA": {
                "name": "Criminal & Gang Anonymous",
                "triggers": ["gang", "crime", "violence", "prison", "arrest"],
                "resources": ["support meetings", "counseling", "rehabilitation"]
            },
            "AA": {
                "name": "Alcoholics Anonymous",
                "triggers": ["drink", "alcohol", "drunk", "relapse", "sober"],
                "resources": ["meetings", "sponsors", "sobriety support"]
            },
            "NA": {
                "name": "Narcotics Anonymous",
                "triggers": ["drugs", "high", "addiction", "substance", "clean"],
                "resources": ["recovery meetings", "addiction support", "rehabilitation"]
            },
            "EI": {
                "name": "Emotional Intelligence",
                "triggers": ["emotions", "feelings", "control", "understand", "react"],
                "resources": ["workshops", "counseling", "emotional management"]
            },
            "AM": {
                "name": "Anger Management",
                "triggers": ["angry", "rage", "control", "temper", "mad"],
                "resources": ["anger management classes", "therapy", "coping techniques"]
            }
        }

    def _init_coping_strategies(self):
        self.coping_strategies = {
            "immediate": [
                "Take 5 deep breaths",
                "Count backwards from 10",
                "Drink some water",
                "Step outside for fresh air"
            ],
            "short_term": [
                "Go for a 10-minute walk",
                "Listen to calming music",
                "Write in your journal",
                "Call a supportive friend"
            ],
            "long_term": [
                "Develop a regular exercise routine",
                "Practice daily meditation",
                "Join a support group",
                "Start therapy sessions"
            ]
        }

    def is_crisis_situation(self, message: str) -> bool:
        """Check if message indicates a crisis."""
        message = message.lower()
        return any(keyword in message for keyword in self.crisis_keywords)

    async def get_response(self, message: str, user_context: Dict) -> Tuple[str, str, Dict]:
        """Enhanced response generation with context awareness."""
        message = message.lower()
        
        # Check for crisis
        if self.is_crisis_situation(message):
            return self._handle_crisis_situation()
        
        # Check for support group triggers
        group_response = self._check_support_group_triggers(message)
        if group_response:
            return group_response
        
        # Handle check-in
        if user_context.get("in_checkin"):
            return self._handle_checkin_response(user_context)
        
        # Analyze emotional content
        emotion_type = self._detect_emotion(message)
        if emotion_type:
            return self._generate_emotion_based_response(emotion_type)
        
        # Default response
        return self._generate_supportive_response(message)

    def _handle_crisis_situation(self) -> Tuple[str, str, Dict]:
        """Handle crisis situations."""
        return (
            "I'm concerned about what you've shared. You're not alone. "
            "Would you like me to connect you with a crisis counselor? "
            "You can also call 988 for immediate support.",
            "crisis",
            {"priority": "high"}
        )

    def _handle_checkin_response(self, context: Dict) -> Tuple[str, str, Dict]:
        """Handle check-in responses."""
        question_num = context.get("checkin_question", 0)
        if question_num < len(self.daily_checkin_questions):
            return (self.daily_checkin_questions[question_num], "check_in", context)
        context["in_checkin"] = False
        return ("Thank you for completing your check-in!", "check_in", context)

    def _generate_supportive_response(self, message: str) -> Tuple[str, str, Dict]:
        """Generate a supportive response for general messages."""
        responses = [
            "I hear you. Would you like to tell me more?",
            "That sounds challenging. How can I support you?",
            "I'm here to listen. What else is on your mind?",
            "Thank you for sharing. How are you feeling now?",
            "Would you like to explore some coping strategies?"
        ]
        return (responses[hash(message) % len(responses)], "general", {})

    def _detect_emotion(self, message: str) -> Optional[str]:
        """Detect primary emotion from message."""
        for emotion, keywords in self.emotional_patterns.items():
            if any(keyword in message for keyword in keywords):
                return emotion
        return None

    def _generate_emotion_based_response(self, emotion_type: str) -> Tuple[str, str, Dict]:
        """Generate response based on detected emotion."""
        responses = {
            "anger": (
                "I can hear that you're feeling angry. Would you like to explore "
                "some anger management techniques?",
                "emotional",
                {"suggested_group": "AM"}
            ),
            "anxiety": (
                "It sounds like you're experiencing anxiety. Let's work on some "
                "calming techniques together.",
                "emotional",
                {"coping_strategies": self.coping_strategies["immediate"]}
            ),
            "depression": (
                "I hear that you're feeling down. Remember that you're not alone. "
                "Would you like to talk to someone who can help?",
                "emotional",
                {"resources": ["crisis hotline", "therapy referrals"]}
            ),
            "positive": (
                "I'm glad you're feeling positive! Would you like to explore ways "
                "to maintain this momentum?",
                "emotional",
                {"activities": ["gratitude journaling", "positive affirmations"]}
            )
        }
        return responses.get(emotion_type, self._generate_supportive_response(""))

    def _check_support_group_triggers(self, message: str) -> Optional[Tuple[str, str, Dict]]:
        """Check if message triggers support group recommendations."""
        for group_id, group_info in self.support_groups.items():
            if any(trigger in message for trigger in group_info["triggers"]):
                response = (
                    f"I notice you mentioned something related to {group_info['name']}. "
                    f"Would you like information about support resources?",
                    "support_group",
                    {
                        "group": group_id,
                        "resources": group_info["resources"]
                    }
                )
                return response
        return None

    async def start_daily_checkin(self) -> Tuple[str, Dict]:
        """Start daily check-in process."""
        context = {
            "in_checkin": True,
            "checkin_question": 0,
            "responses": {}
        }
        return (
            f"Let's do your daily check-in! {self.daily_checkin_questions[0]}",
            context
        )

    async def process_checkin_response(self, response: str, context: Dict) -> Tuple[str, Dict, bool]:
        """Process a check-in response and return next question or completion."""
        question_num = context.get("checkin_question", 0)
        context["responses"][str(question_num)] = response
        
        question_num += 1
        context["checkin_question"] = question_num
        
        is_complete = question_num >= len(self.daily_checkin_questions)
        if is_complete:
            context["in_checkin"] = False
            next_message = "Check-in complete! Here's a summary of your responses:"
        else:
            next_message = self.daily_checkin_questions[question_num]
            
        return next_message, context, is_complete

    async def analyze_chat_patterns(self, user_id: str, days: int = 30) -> Dict:
        """Analyze chat patterns for insights."""
        return {
            "common_topics": ["anxiety", "work stress", "family"],
            "emotional_trends": {
                "positive": 35,
                "neutral": 45,
                "negative": 20
            },
            "peak_activity_times": ["morning", "late evening"],
            "suggested_resources": [
                "Stress Management Workshop",
                "Sleep Hygiene Guide",
                "Meditation Sessions"
            ]
        }

    async def get_support_group_recommendation(self, user_context: Dict) -> Optional[Dict]:
        """Recommend support groups based on user context."""
        pass  # Implementation can be added as needed
