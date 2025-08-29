import json
import os
import csv
import yaml
from backend.agents.base_agent import BaseAgent


class SummeryCsvAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.input_file = os.path.join(
            os.path.dirname(__file__), "..", "json_dump", "analyser_agent.json"
        )
        self.output_file = os.path.join(
            os.path.dirname(__file__), "outputs", "summery.csv"
        )
        outputs_dir = os.path.join(os.path.dirname(__file__), "outputs")
        os.makedirs(outputs_dir, exist_ok=True)

    def generate_summary_csv(self):
        """
        Reads analyser_agent.json, sends to Gemini with a prompt from prompts.yaml, extracts summary, and outputs required fields to a CSV file.
        """
        if not os.path.exists(self.input_file):
            print(f"Input file not found: {self.input_file}")
            return None
        try:
            with open(self.input_file, "r", encoding="utf-8") as f:
                analyser_data = json.load(f)
        except Exception as e:
            print(f"Error reading analyser_agent.json: {e}")
            return None

        # Load prompt from prompts.yaml
        prompt_path = os.path.join(os.path.dirname(__file__), "prompts", "prompts.yaml")
        with open(prompt_path, "r", encoding="utf-8") as pf:
            prompts_yaml = yaml.safe_load(pf)
        prompt_template = prompts_yaml["prompts"].get("summery_csv_agent")
        input_text = prompt_template + "\n\n" + json.dumps(analyser_data, indent=2)
        system_prompt = (
            self.get_system_prompt("summary_agent")
            or "You are a legal compliance summarizer."
        )
        response = self.run(system_prompt, input_text)
        if not response:
            print("No response from Gemini agent.")
            return None

        # Expecting response to be a list of dicts
        try:
            summary_list = (
                json.loads(response) if isinstance(response, str) else response
            )
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            return None

        # Write to CSV
        try:
            with open(self.output_file, "w", newline="", encoding="utf-8") as csvfile:
                fieldnames = ["feature", "geo_flag", "reasoning", "regulations"]
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for row in summary_list:
                    writer.writerow(
                        {
                            "feature": row.get("feature", ""),
                            "geo_flag": row.get("geo_flag", ""),
                            "reasoning": row.get("reasoning", ""),
                            "regulations": row.get("regulations", ""),
                        }
                    )
            print(f"Summary CSV saved to {self.output_file}")
            return self.output_file
        except Exception as e:
            print(f"Error writing CSV: {e}")
            return None
