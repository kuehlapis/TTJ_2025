from pydantic import BaseModel
from typing import Optional


class IntakeOutput(BaseModel):
    country: Optional[str]
    continent: Optional[str]
    states: Optional[str]
