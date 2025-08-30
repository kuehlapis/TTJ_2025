from main import ExcelMain, IntakeAgentMain
from agents.analyzer_agent import AnalyzerAgent
import asyncio
import json


async def main():
    analyzer = AnalyzerAgent()  # Create instance here instead of importing from main

    texts = ExcelMain.get_content()
    print(texts)
    cleaned_text = IntakeAgentMain.normalization(texts)  # string

    region = IntakeAgentMain.extract_region(cleaned_text)  # JSON output

    print("\nAnalyzing...")
    result = await analyzer.analyze_question(cleaned_text, region)
    if result:
        print("Successfully Analyzed ")

    with open("agents/outputs/analyzer_output.json", "w", encoding="utf-8") as f:
        json.dump(result.model_dump(), f, indent=2, ensure_ascii=False)
        print("Analysis saved to analyzer_output.json")


if __name__ == "__main__":
    asyncio.run(main())
