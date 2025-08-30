from backend.agents.base_agent import BaseAgent
import yaml
from datetime import datetime
import os
import json
from typing import List, Dict


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

    def extract_region(self, jurisdiction: dict) -> dict:
        result = []
        result.append(jurisdiction["country"])
        result.append(jurisdiction["continent"])
        result.append(jurisdiction["state"])
        return result

    def extract_legal(self, region: List[str]) -> Dict[str]:
        result = {}

        for i in region:
            if i in self.legalbook["geo"]:
                result.update(self.legalbook["geo"][i])
            else:
                continue
        return result

    async def analyze_question(self, user_input: str, jurisdiction: dict) -> dict:
        """Process user's input using the QA template and legalbook"""
        try:
            system_prompt = self.get_system_prompt("analyser_agent")

            formatted_question = self._wrap_question(user_input, jurisdiction)
            print(formatted_question)

            response = self.run(system_prompt, formatted_question)

            # Debug the raw response
            print("\nDebug - Raw Response:")
            print(response)

            # Structure the response immediately
            structured = self._structure_response(response)

            return {
                "status": "success",
                "question": user_input,
                "analysis": structured,
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            print(f"Error in analyze_question: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
            }

    def _wrap_question(self, question: str, jurisdiction: str = None) -> str:
        """Wrap the user question in the QA template"""
        kb_yaml = yaml.dump(self.legalbook) if self.legalbook else ""

        return self.qa_template.format(
            YYYY_MM_DD=datetime.now().strftime("%Y-%m-%d"),
            JURISDICTION_HINT=jurisdiction or "",
            RAW_USER_INPUT=question,
            KB_YAML_SNIPPETS=kb_yaml,
        )

    def _structure_response(self, response: str) -> dict:
        """Parse and structure the LLM response"""
        try:
            # Default structure
            analysis_dict = {
                "feature": "",
                "description": "No description provided",
                "analysis": "No analysis provided",
                "risk": "MEDIUM",
                "regulations": [],
                "recommendation": "No recommendation provided",
            }

            # Clean up the response
            cleaned_response = (
                response.replace("```json", "").replace("```", "").strip()
            )

            # Try to parse as JSON first
            try:
                if cleaned_response.startswith("{"):
                    parsed = json.loads(cleaned_response)
                    # Update only valid fields
                    for key in analysis_dict.keys():
                        if key in parsed and parsed[key]:
                            analysis_dict[key] = parsed[key]
                    return analysis_dict
            except json.JSONDecodeError:
                pass

            # Fallback to line-by-line parsing
            # current_key = None
            # current_value = []

            for line in cleaned_response.split("\n"):
                line = line.strip()
                if not line:
                    continue

                # Check for key indicators
                if ":" in line:
                    key, value = line.split(":", 1)
                    key = key.strip().lower().replace('"', "")
                    value = value.strip().strip('"').strip(",")

                    if key in analysis_dict:
                        if key == "regulations":
                            if "[" in value:
                                regs = value.strip("[]").split(",")
                                analysis_dict["regulations"].extend(
                                    r.strip().strip('"') for r in regs if r.strip()
                                )
                        else:
                            analysis_dict[key] = value

            return analysis_dict

        except Exception as e:
            print(f"Error in _structure_response: {str(e)}")
            return {
                "feature": "Analysis Failed",
                "description": "Error processing response",
                "analysis": f"Error: {str(e)}",
                "risk": "HIGH",
                "regulations": [],
                "recommendation": "Please review input and try again",
            }

    async def analyze_from_file(self, input_file: str) -> dict:
        """Analyze case from text file"""
        try:
            with open(input_file, "r") as file:
                query = file.read().strip()

            # Process single text input
            result = await self.analyze_question(query, "EU")
            return (
                result["analysis"]
                if result["status"] == "success"
                else {
                    "feature": "Geo-targeted Advertising",
                    "description": "Analysis failed",
                    "analysis": result["error"],
                    "risk": "HIGH",
                    "regulations": [],
                    "recommendation": "Error occurred during analysis",
                }
            )
        except Exception as e:
            return {
                "feature": "Error",
                "description": "File processing error",
                "analysis": str(e),
                "risk": "HIGH",
                "regulations": [],
                "recommendation": "Check input file and try again",
            }


# async def main():
#     try:
#         analyzer = AnalyzerAgent()
#         input_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'test_inputs.txt')
#         result = await analyzer.analyze_from_file(input_file)

#         print("\nAnalysis Results:")
#         print("================")
#         print(f"Feature: {result.get('feature', 'Not specified')}")
#         print(f"Description: {result.get('description', 'No description')}")
#         print(f"Analysis: {result.get('analysis', 'No analysis')}")
#         print(f"Risk Level: {result.get('risk', 'Not assessed')}")
#         print("Regulations:")
#         for reg in result.get('regulations', []):
#             print(f"  - {reg}")
#         print(f"Recommendation: {result.get('recommendation', 'No recommendation')}")
#         print("-" * 50)

#     except Exception as e:
#         print(f"Error: {str(e)}")

# if __name__ == "__main__":
#     import asyncio
#     asyncio.run(main())
