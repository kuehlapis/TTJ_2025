from backend.agents.base_agent import BaseAgent
import yaml
from datetime import datetime
import os
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
            response = self.run(system_prompt, formatted_question)
            return response
            # print("\nDebug - Raw Response:")

            # structured = self._structure_response(response)

            # return {
            #     "status": "success",
            #     "question": user_input,
            #     "analysis": structured,
            #     "timestamp": datetime.now().isoformat(),
            # }
        except Exception as e:
            print(f"Error in analyze_question: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
            }

    def _structure_response(self, response: str) -> Dict[str, Any]:
        """Parse and structure the LLM response"""
        try:
            # Default structure
            analysis_dict = {
                "feature": "",
                "description": "No description provided",
                "analysis": "",
                "risk": "MEDIUM",
                "regulations": [],
                "recommendation": "",
                "details": {
                    "legal_requirements": [],
                    "feature_analysis": [],
                    "jurisdictional_notes": "",
                    "compliance_tasks": [],
                },
            }

            # Parse sections from the response
            sections = response.split("\n\n")
            # current_section = None

            for section in sections:
                if "Legal Requirements & Obligations" in section:
                    # Extract regulations
                    for line in section.split("\n"):
                        if "**" in line and ":" in line:
                            reg = line.split(":", 1)[0].strip("* ")
                            analysis_dict["regulations"].append(reg)

                elif "Feature Analysis" in section:
                    # Extract feature details and risks
                    analysis_dict["analysis"] = section.strip()
                    # Determine risk level based on content
                    if "HIGH" in section.upper() or "CRITICAL" in section.upper():
                        analysis_dict["risk"] = "HIGH"

                elif "Actionable Analysis & Recommendations" in section:
                    # Extract recommendations
                    recommendations = []
                    for line in section.split("\n"):
                        if "|" in line and "Recommendation" in line:
                            rec = line.split("|")[-1].strip()
                            recommendations.append(rec)
                    analysis_dict["recommendation"] = "\n".join(recommendations)

                elif "Ongoing Compliance" in section:
                    # Add compliance tasks
                    for line in section.split("\n"):
                        if line.strip().startswith("*"):
                            analysis_dict["details"]["compliance_tasks"].append(
                                line.strip("* ")
                            )

            # If no structured data was found, use the raw response
            if not any(analysis_dict["regulations"]):
                analysis_dict["analysis"] = response

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
                "details": {},
            }

    async def analyze_from_file(self, input_file: str) -> Dict[str, Any]:
        """Analyze case from text file"""
        try:
            with open(input_file, "r") as file:
                query = file.read().strip()

            # Process single text input
            result = await self.analyze_question(query, "EU")
            print(result)
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
