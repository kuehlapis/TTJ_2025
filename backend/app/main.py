from datetime import datetime, timezone, timedelta
from uuid import uuid4
from typing import List, Literal, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, AnyHttpUrl


app = FastAPI(title="TTJ_2025 API (MVP)", version="0.0.1")


# CORS for Vite dev on localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- In-memory store (MVP only) ----
STORE: Dict[str, dict] = {}



class StartAnalysisBody(BaseModel):
    url: AnyHttpUrl
    device: Literal["desktop", "mobile"]
    analysis_types: List[Literal[
        "consistency",
        "exceptions",
        "satisfaction",
        "efficiency",
    ]] = []



class AnalysisStatus(BaseModel):
    id: str
    url: AnyHttpUrl
    device: str
    status: Literal["queued", "running", "completed", "failed"]
    started_at: datetime
    finished_at: Optional[datetime] = None
    overall_score: Optional[float] = None
    # findings, artifacts, metrics to be added later
    # findings: List[dict] = []
    # artifacts: List[dict] = []
    # metrics: List[dict] = []



@app.get("/health")
def health():
    return {"ok": True, "ts": datetime.now(timezone.utc).isoformat()}



@app.post("/analyses", response_model=AnalysisStatus)
def start_analysis(body: StartAnalysisBody):
    aid = str(uuid4())
    now = datetime.now(timezone.utc)
    STORE[aid] = {
        "id": aid,
        "url": str(body.url),
        "device": body.device,
        "status": "running",  # start immediately for demo
        "started_at": now,
        "finished_at": None,
        "overall_score": None,
        "analysis_types": body.analysis_types,
    }
    return AnalysisStatus(**STORE[aid])



@app.get("/analyses/{analysis_id}", response_model=AnalysisStatus)
def get_analysis(analysis_id: str):
    item = STORE.get(analysis_id)
    if not item:
        raise HTTPException(status_code=404, detail="Analysis not found")

    # Minimal fake lifecycle: auto-complete after 6s with a dummy score
    now = datetime.now(timezone.utc)
    started = item["started_at"]
    if item["status"] in ("queued", "running") and (now - started) > timedelta(seconds=6):
        item["status"] = "completed"
        item["finished_at"] = now
        item["overall_score"] = 82.0  # placeholder
        # TODO: fill in findings/artifacts/metrics later

    return AnalysisStatus(**item)


# Placeholder routes (commented until implemented)
# @app.get("/reports"): ...
# @app.get("/analyses/{id}/artifacts"): ...
# @app.post("/re-run"): ...
