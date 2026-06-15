from pydantic import BaseModel
from typing import List, Optional

class IncidentStoreRequest(BaseModel):
    content: str

class IncidentSearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 5

class IncidentAnalyzeRequest(BaseModel):
    query: str
    
class MemoryResult(BaseModel):
    text: str
    metadata: Optional[dict] = None

class SearchResponse(BaseModel):
    status: str
    results: List[MemoryResult]

class AnalyzeResponse(BaseModel):
    status: str
    insight: str

class WorkflowRequest(BaseModel):
    incident_content: str

class WorkflowResponse(BaseModel):
    status: str
    state: dict

class DeploymentRiskRequest(BaseModel):
    service: str
    version: str
    change_summary: str

class DeploymentRiskResponse(BaseModel):
    risk_score: str
    confidence: str
    similar_incidents: List[str]
    recommended_precautions: List[str]
