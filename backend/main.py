from backend.agents.legal_agent import LegalAgent
from backend.repository.rulebook_repo import RulebookRepository
from backend.service.crawler_service import CrawlerService
from backend.agents.analyzer_agent import AnalyzerAgent
from backend.agents.intake_agent import IntakeAgent
from backend.service.excel_service import ExcelService
from backend.agents.summery_csv_agent import SummeryCsvAgent
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
import os

# Initialize services and agents
RuleBook = RulebookRepository()
CrawlerMain = CrawlerService()
ExcelMain = ExcelService()
LegalAgentMain = LegalAgent()
AnalyzerAgentMain = AnalyzerAgent()
IntakeAgentMain = IntakeAgent()
SummeryCsvAgentMain = SummeryCsvAgent()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/analyze")
async def analyze(text: str = Query(..., description="Text to analyze")):
    try:
        # Process the input text
        cleaned_text = IntakeAgentMain.normalization(text)
        region = IntakeAgentMain.extract_region(cleaned_text)

        # Analyze the text
        result = await AnalyzerAgentMain.analyze_question(cleaned_text, region)

        # Save and return results
        with open("agents/outputs/analyzer_output.json", "w", encoding="utf-8") as f:
            output = result.model_dump()
            json.dump(output, f, indent=2, ensure_ascii=False)
            print("Analysis saved to analyzer_output.json")
        result = SummeryCsvAgentMain.generate_summary_csv()
        SummeryCsvAgentMain.get_csv(result)

        return {
            "status": "success",
            "data": output,
            "message": "Analysis completed successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/result")
async def fetch_output():
    """ " """
    result = SummeryCsvAgentMain.generate_summary_csv()
    return result


@app.get("/summary")
def fetch_csv():
    """To download csv from frontend"""
    file_path = "agents/outputs/summery.csv"

    if not os.path.exists(file_path):
        return {"error": "CSV file not found."}

    return FileResponse(path=file_path, filename="summery.csv", media_type="text/csv")
