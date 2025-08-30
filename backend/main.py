from backend.agents.legal_agent import LegalAgent
from backend.repository.rulebook_repo import RulebookRepository
from backend.service.crawler_service import CrawlerService
from backend.agents.analyzer_agent import AnalyzerAgent
from backend.agents.intake_agent import IntakeAgent
from backend.service.excel_service import ExcelService
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


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


@app.get("/")
async def read_root():
    return {"message": "hi gays"}
