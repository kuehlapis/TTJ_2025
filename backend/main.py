from backend.agents.legal_agent import LegalAgent
from backend.repository.rulebook_repo import RulebookRepository
from backend.service.crawler_service import CrawlerService
from backend.agents.analyzer_agent import AnalyzerAgent
from backend.agents.intake_agent import IntakeAgent
from backend.service.excel_service import ExcelService
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json

# Initialize services and agents
RuleBook = RulebookRepository()
CrawlerMain = CrawlerService()
ExcelMain = ExcelService()
LegalAgentMain = LegalAgent()
AnalyzerAgentMain = AnalyzerAgent()
IntakeAgentMain = IntakeAgent()

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
        with open(
            "backend/agents/outputs/analyzer_output.json", "w", encoding="utf-8"
        ) as f:
            output = result.model_dump()
            json.dump(output, f, indent=2, ensure_ascii=False)
            print("Analysis saved to analyzer_output.json")

        return {
            "status": "success",
            "data": output,
            "message": "Analysis completed successfully",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
