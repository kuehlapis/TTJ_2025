import json
import os
import csv
import yaml
import re

try:
    from base_agent import BaseAgent
except ModuleNotFoundError:
    from base_agent import BaseAgent


class SummeryCsvAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.input_file = os.path.join(
            os.path.dirname(__file__), "..", "json_dump", "analyzer_output.json"
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
        print("Available prompts:", prompts_yaml["prompts"].keys())
        prompt_template = prompts_yaml["prompts"].get("summery_csv_agent")
        if not prompt_template:
            print("Error: 'summery_csv_agent' prompt not found in prompts.yaml.")
            return None
        input_text = prompt_template + "\n\n" + json.dumps(analyser_data, indent=2)
        system_prompt = (
            self.get_system_prompt("summary_agent")
            or "You are a legal compliance summarizer."
        )
        response = self.run(system_prompt, input_text)
        print("Gemini response:", response)
        if not response:
            print("No response from Gemini agent.")
            return None

        # Expecting response to be a list of dicts

        try:
            if isinstance(response, str):
                # Extract JSON array from response, even if extra text is present
                match = re.search(r"```json\s*(\[[\s\S]*?\])\s*```", response)
                if match:
                    response_clean = match.group(1)
                else:
                    # Fallback: try to find the first JSON array in the string
                    match = re.search(r"(\[[\s\S]*?\])", response)
                    response_clean = match.group(1) if match else response
                summary_list = json.loads(response_clean)
            else:
                summary_list = response
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            return None

        # Write to CSV
        try:
            if isinstance(summary_list, dict):
                summary_list = [summary_list]
            # Load original analyser_data for context
            with open(self.input_file, "r", encoding="utf-8") as f:
                original_data = json.load(f)
            # If original_data is a dict, convert to list
            if isinstance(original_data, dict):
                original_data = [original_data]
            # Collect all keys from Gemini and original JSON
            all_keys = set()
            for row in summary_list:
                all_keys.update(row.keys())
            for row in original_data:
                all_keys.update(row.keys())
            required_fields = [
                "geolocation",
                "severity",
                "law",
                "reasoning",
                "potential_violations",
                "recommendations",
                "legal_references",
                "geo_compliance_flag",
            ]
            fieldnames = required_fields + [
                k for k in all_keys if k not in required_fields
            ]
            with open(self.output_file, "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for i, row in enumerate(summary_list):
                    # Always include geolocation and other context from original JSON
                    context_row = original_data[i] if i < len(original_data) else {}
                    # Always set geolocation from context_row if present
                    if "geolocation" in context_row:
                        row["geolocation"] = context_row["geolocation"]
                    for key in required_fields:
                        if key not in row and key in context_row:
                            row[key] = context_row[key]
                    # Add Gemini's geo-specific compliance flag if not present
                    if "geo_compliance_flag" not in row:
                        row["geo_compliance_flag"] = (
                            "REQUIRED" if row.get("geolocation") else "NOT REQUIRED"
                        )
                    writer.writerow(row)
            print(f"Summary CSV saved to {self.output_file}")
            return self.output_file
        except Exception as e:
            print(f"Error writing CSV: {e}")
            return None


if __name__ == "__main__":
    agent = SummeryCsvAgent()
    result = agent.generate_summary_csv()
    print("CSV output file:", result)
