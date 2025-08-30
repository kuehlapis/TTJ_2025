from backend.main import AnalyzerAgentMain, IntakeAgentMain, ExcelMain
import json
import asyncio

async def main():

    texts = ExcelMain.get_content()
    print(texts)
    cleaned_text = IntakeAgentMain.normalization(texts) #string

    region = IntakeAgentMain.extract_region(cleaned_text) #JSON output

    # IntakeAgentMain.save_output(cleaned_text, region)
    print("\nAnalyzing...")
    result = await AnalyzerAgentMain.analyze_question(cleaned_text, region)
    print(result.model_dump())

    # Write result to JSON file
    with open("backend/agents/outputs/analyzer_output.json", "w", encoding="utf-8") as f:
        json.dump(result.model_dump(), f, indent=2, ensure_ascii=False)
        print(f"Analysis saved to analyzer_output.json")

if __name__ == '__main__':
    asyncio.run(main())