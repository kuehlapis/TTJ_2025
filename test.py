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

    with open(
        "backend/agents/outputs/analyzer_output.txt", "w", encoding="utf-8"
        ) as f:
            f.write("Response:\n")
            f.write(result)

    # result = AnalyzerAgentMain.analyze_question(question, jurisdiction)

    # if result["status"] == "success":
    #     print("\nAnalysis Result:")
    #     print("--------------")
    #     print(result["analysis"])
    # else:
    #     print(f"\nError: {result['error']}")

if __name__ == '__main__':
    asyncio.run(main())