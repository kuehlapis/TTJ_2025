from pydantic import BaseModel
from typing import Optional


class IntakeOutput(BaseModel):
    country: Optional[str]
    continent: Optional[str]
    states: Optional[str]

class AnalzyerOutput(BaseModel):
    geolocation: str
    law: str
    severity: str
    confidence: str
    reasoning: str
    potential_violations: str
    evidence: str
    recommendations: str
    legal_references: str

