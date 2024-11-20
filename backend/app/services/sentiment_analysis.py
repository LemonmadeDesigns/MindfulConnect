# backend/app/services/sentiment_analysis.py

from typing import Dict, List, Tuple
from openai import AsyncOpenAI
from ..core.config import settings

class SentimentAnalyzer:
    def __init__(self):
        """
        Initialize SentimentAnalyzer with OpenAI client
        Requires valid OpenAI API key in settings
        """
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def analyze_mood_entry(self, description: str) -> Tuple[float, Dict]:
        """
        Analyze mood description using GPT for sentiment and emotions
        
        Args:
            description: User's mood description text
            
        Returns:
            Tuple of (sentiment_score, detailed_analysis)
        """
        try:
            # Call OpenAI API for sentiment analysis
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": """
                    Analyze the mood description and provide:
                    1. Sentiment score (-1 to 1)
                    2. Identified emotions
                    3. Potential triggers
                    4. Helpful suggestions
                    5. Risk level (low/medium/high)
                    Return analysis as a structured list.
                    """},
                    {"role": "user", "content": description}
                ]
            )
            
            # Parse API response
            analysis_text = response.choices[0].message.content
            analysis = self._parse_analysis(analysis_text)
            
            return analysis.get("sentiment_score", 0.0), analysis
            
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            return 0.0, self._get_default_analysis()

    def _parse_analysis(self, analysis_text: str) -> Dict:
        """
        Parse GPT response into structured data
        
        Args:
            analysis_text: Raw text response from GPT
            
        Returns:
            Structured dictionary of analysis results
        """
        try:
            lines = analysis_text.strip().split('\n')
            analysis = {
                "sentiment_score": 0.0,
                "emotions": [],
                "triggers": [],
                "suggestions": [],
                "risk_level": "low"
            }
            
            current_section = None
            for line in lines:
                line = line.strip()
                # Parse sentiment score
                if "sentiment score" in line.lower():
                    try:
                        analysis["sentiment_score"] = float(line.split(":")[-1].strip())
                    except:
                        pass
                # Parse sections
                elif "emotions" in line.lower():
                    current_section = "emotions"
                elif "triggers" in line.lower():
                    current_section = "triggers"
                elif "suggestions" in line.lower():
                    current_section = "suggestions"
                elif "risk level" in line.lower():
                    value = line.split(":")[-1].strip().lower()
                    if value in ["low", "medium", "high"]:
                        analysis["risk_level"] = value
                # Add content to current section
                elif line and current_section:
                    if line.startswith("- "):
                        line = line[2:]
                    analysis[current_section].append(line)
            
            return analysis
            
        except Exception as e:
            print(f"Error parsing analysis: {e}")
            return self._get_default_analysis()

    def _get_default_analysis(self) -> Dict:
        """
        Provide default analysis structure for error cases
        
        Returns:
            Default analysis dictionary
        """
        return {
            "sentiment_score": 0.0,
            "emotions": ["unknown"],
            "triggers": [],
            "suggestions": ["Unable to analyze"],
            "risk_level": "low"
        }

    # ... [Additional methods]
    async def generate_coping_strategies(self, mood_data: dict) -> List[str]:
        """Generate personalized coping strategies based on mood data."""
        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": """
                    Based on the user's mood data, provide 3 specific, 
                    actionable coping strategies. Focus on practical, 
                    immediate actions they can take. Format as a bullet list.
                    """},
                    {"role": "user", "content": str(mood_data)}
                ]
            )
            
            strategies_text = response.choices[0].message.content
            strategies = [s.strip()[2:].strip() if s.strip().startswith('- ') else s.strip() 
                         for s in strategies_text.split('\n') 
                         if s.strip()]
            
            return strategies[:3]
            
        except Exception as e:
            print(f"Error generating coping strategies: {e}")
            return [
                "Take deep breaths for a few minutes",
                "Go for a short walk if possible",
                "Talk to someone you trust"
            ]