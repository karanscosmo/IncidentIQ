from typing import TypedDict, List, Optional
from pydantic import BaseModel

class IncidentState(TypedDict):
    """
    State representing the LangGraph workflow for incident resolution.
    """
    incident_content: str
    analysis: Optional[str]
    memories: Optional[List[str]]
    root_cause: Optional[str]
    resolution: Optional[str]
    postmortem: Optional[str]
    learning: Optional[str]
