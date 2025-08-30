from backend.agents.base_agent import BaseAgent
import json
import re
from backend.schema.schemas import IntakeOutput
from typing import Optional, Dict


class IntakeAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        mapping = self.fetch_mapping()
        self.continent = mapping.get("continent", {})
        self.terminology = mapping.get("terminology", {})

        self.sorted_terms = (
            sorted(self.terminology.keys(), key=len, reverse=True)
            if self.terminology
            else []
        )

    def fetch_mapping(self):
        try:
            with open("backend/util/mapping.json", "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error fetching mapping: {e}")
            return {}

    def clean_text(self, input: str) -> str:
        cleaned_text = input.strip()
        return cleaned_text

    def normalization(self, input_text: str) -> str:
        for term in self.sorted_terms:
            pattern = re.compile(r"\b" + re.escape(term) + r"\b", re.IGNORECASE)
            replacement = f"{term} ({self.terminology[term]})"
            input_text = pattern.sub(replacement, input_text)
        return input_text

    def extract_region(self, input_text: str) -> Dict[str, Optional[str]]:
        try:
            system_prompt = self.get_system_prompt("legal_agent")
        except Exception as e:
            print(f"Error getting system prompt for intake agent: {e}")
            return None
        try:
            response: IntakeOutput = self.run(system_prompt, input_text, IntakeOutput)
            response.continent = self.continent.get(
                response.continent, response.continent
            )
            if response.states:
                response.states = f"{response.country}-{response.states}"

            return response.model_dump()
        except Exception as e:
            print(f"Error getting response from intake agent: {e}")
            return None

    def save_output(self, response: str, region: Dict[str, Optional[str]]) -> str:
        with open(
            "backend/agents/outputs/intake_output.txt", "w", encoding="utf-8"
        ) as f:
            f.write("Response:\n")
            f.write(response + "\n\n")
            f.write("Region JSON:\n")
            f.write(json.dumps(region.model_dump(), indent=2))
