from backend.agents.base_agent import BaseAgent
import yaml
from datetime import datetime
import os


class AnalyzerAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.legalbook = None
        self.qa_template = None
        self.system_prompt = None

        try:
            # Load legalbook.yaml
            legalbook_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'legalbook.yaml')
            with open(legalbook_path, 'r') as file:
                self.legalbook = yaml.safe_load(file)

            # Load prompts.yaml
            prompts_path = os.path.join(os.path.dirname(__file__), 'prompts', 'prompts.yaml')
            with open(prompts_path, 'r') as file:
                prompts = yaml.safe_load(file)
                self.qa_template = prompts['prompts']['qa_user_template']
                self.system_prompt = prompts['prompts']['base']

        except Exception as e:
            raise ValueError(f"Failed to initialize AnalyzerAgent: {str(e)}")

    async def analyze_question(self, user_question: str, jurisdiction: str = None) -> dict:
        """Process user's question using the QA template and legalbook"""
        try:
            # Prepare the wrapped question using template
            formatted_question = self._wrap_question(user_question, jurisdiction)

            # Prepare messages for LLM
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": formatted_question}
            ]

            # Query LLM with wrapped question and legalbook context
            response = await self.query_llm(messages)

            # Parse and structure the response
            structured_response = self._structure_response(response)

            return {
                "status": "success",
                "question": user_question,
                "analysis": structured_response,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    def _wrap_question(self, question: str, jurisdiction: str = None) -> str:
        """Wrap the user question in the QA template"""
        kb_yaml = yaml.dump(self.legalbook) if self.legalbook else ""

        return self.qa_template.format(
            YYYY_MM_DD=datetime.now().strftime("%Y-%m-%d"),
            JURISDICTION_HINT=jurisdiction or "",
            RAW_USER_INPUT=question,
            KB_YAML_SNIPPETS=kb_yaml
        )

    def _structure_response(self, response: str) -> str:
        """Format the response to ensure it's properly structured"""
        # If response doesn't follow template format, try to structure it
        if "**Answer:**" not in response:
            parts = response.split("\n")
            structured = [
                "**Answer:** " + (parts[0] if parts else "Unclear"),
                "\n**Why:**",
                "- " + (" ".join(parts[1:]) if len(parts) > 1 else "No additional details provided"),
                "\n**Confidence:** 0.5",
                "\n**Disclaimer:** This is general information, not legal advice."
            ]
            return "\n".join(structured)
        return response