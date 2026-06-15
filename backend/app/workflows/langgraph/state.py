from typing import TypedDict, List, Optional, Any
from pydantic import BaseModel

class IncidentState(TypedDict):
    """
    State representing the LangGraph workflow for incident resolution.
    """
    incident_content: str
    analysis: Optional[str]
    memories: Optional[List[str]]
    memories_retrieved: Optional[List[dict]]
    root_cause: Optional[str]
    resolution: Optional[str]
    postmortem: Optional[str]
    learning: Optional[str]
