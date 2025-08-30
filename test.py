from backend.main import AnalyzerAgentMain, IntakeAgentMain, ExcelMain

import asyncio

async def main():

    texts = ExcelMain.get_content()

    cleaned_text = IntakeAgentMain.normalization(texts[0], texts[1]) #string

    region = IntakeAgentMain.extract_region(cleaned_text) #JSON output

    # IntakeAgentMain.save_output(cleaned_text, region)
    print("test")
    print(region)
    print(cleaned_text)
    print("\nAnalyzing...")
    result = await AnalyzerAgentMain.analyze_question(cleaned_text, region)

    # result = AnalyzerAgentMain.analyze_question(question, jurisdiction)

    if result["status"] == "success":
        print("\nAnalysis Result:")
        print("--------------")
        print(result["analysis"])
    else:
        print(f"\nError: {result['error']}")

if __name__ == '__main__':
    asyncio.run(main())