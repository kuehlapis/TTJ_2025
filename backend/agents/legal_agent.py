from backend.agents.base_agent import BaseAgent
import re


class LegalAgent(BaseAgent):
    def __init__(self):
        super().__init__()

    def extract_legals(self, markdown_output: str) -> str:
        system_prompt = self.get_system_prompt("legal_agent")

        try:
            yaml_str = self.run(system_prompt, markdown_output)
            yaml_str = self.clean_yaml(yaml_str)
            return yaml_str

        except Exception as e:
            raise ValueError(f"Error during extraction of legal abstract: {e}")

    def clean_yaml(self, yaml_str: str) -> str:
        # Remove ```yaml or ``` markers and any leading/trailing whitespace/newlines
        yaml_str = re.sub(r"^```yaml\s*", "", yaml_str.strip(), flags=re.IGNORECASE)
        yaml_str = re.sub(r"```$", "", yaml_str.strip())
        yaml_str = yaml_str.replace(r"\(", r"\\(").replace(r"\)", r"\\)")
        yaml_str = yaml_str.encode("utf-8", "ignore").decode("utf-8")
        return yaml_str.strip()
