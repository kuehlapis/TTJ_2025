from backend.agents.base_agent import BaseAgent
import yaml
from datetime import datetime
import os
from backend.schema.schemas import AnalzyerOutput
from typing import List, Dict, Any


class AnalyzerAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.legalbook = None
        self.qa_template = None

        try:
            legalbook_path = os.path.join(
                os.path.dirname(__file__), "rules", "legalbook.yaml"
            )
            with open(legalbook_path, "r", encoding="utf-8") as file:
                self.legalbook = yaml.safe_load(file)

            prompts_path = os.path.join(
                os.path.dirname(__file__), "rules", "format.yaml"
            )
            with open(prompts_path, "r", encoding="utf-8") as file:
                format = yaml.safe_load(file)
                self.qa_template = format["qa_user_template"]

        except Exception as e:
            raise ValueError(f"Failed to initialize AnalyzerAgent: {str(e)}")

    def extract_region(self, jurisdiction: dict) -> List[str]:
        result = []
        result.append(jurisdiction["country"])
        result.append(jurisdiction["continent"])
        result.append(jurisdiction["states"])
        return result

    def extract_legal(self, region: List[str]) -> Dict[str, Any]:
        result = {}

        for i in region:
            if i in self.legalbook["geo"]:
                result.update(self.legalbook["geo"][i])
            else:
                continue
        return result

    def _wrap_question(self, question: str, jurisdiction: str = None) -> str:
        """Simply combine the question with jurisdiction if provided"""
        region_lists = self.extract_region(jurisdiction)
        legal_json = self.extract_legal(region_lists)
        print(legal_json)

        if jurisdiction:
            return f"Referencing the legal compliance: {legal_json}\n for jurisdiction {jurisdiction} check for violation: {question}."

        return question

    async def analyze_question(
        self, user_input: str, jurisdiction: dict
    ) -> Dict[str, Any]:
        """Process user's input using the system prompt"""
        try:
            system_prompt = self.get_system_prompt("analyzer_agent")

            formatted_question = self._wrap_question(user_input, jurisdiction)
            response: AnalzyerOutput = self.run(
                system_prompt, formatted_question, AnalzyerOutput
            )
            return response

        except Exception as e:
            print(f"Error in analyze_question: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
            }
