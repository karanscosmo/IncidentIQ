from fastapi import APIRouter, HTTPException
from app.schemas.schemas import (
    IncidentStoreRequest,
    IncidentSearchRequest,
    IncidentAnalyzeRequest,
    SearchResponse,
    AnalyzeResponse,
    MemoryResult
)
from app.services.hindsight.hindsight_service import (
    store_incident,
    search_incidents,
    analyze_incident
)

router = APIRouter()

@router.post("/store", summary="Store an incident memory")
def store_incident_endpoint(request: IncidentStoreRequest):
    """
    Store a new incident memory into the Hindsight memory bank.
    """
    try:
        store_incident(request.content)
        return {"status": "success", "message": "Incident stored successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store incident: {str(e)}")

@router.post("/search", response_model=SearchResponse, summary="Search for similar incidents")
def search_incidents_endpoint(request: IncidentSearchRequest):
    """
    Retrieve similar incidents based on the provided semantic query.
    """
    try:
        import re
        from datetime import datetime
        
        results = search_incidents(request.query)
        memories = []
        for idx, memory in enumerate(results):
            text = memory.text
            id_match = re.search(r'Incident(?: Summary)?:\s*([\w\s-]+?)\n', text, re.IGNORECASE)
            rc_match = re.search(r'Root Cause:\s*(.+?)(?=\n|$)', text, re.IGNORECASE)
            res_match = re.search(r'Resolution:\s*(.+?)(?=\n|$)', text, re.IGNORECASE)
            
            memories.append(MemoryResult(
                id=id_match.group(1).strip() if id_match else f"INC-MEMORY-{idx}",
                title=text.split('\n')[0][:50] + "...",
                root_cause=rc_match.group(1).strip() if rc_match else "Unknown",
                resolution=res_match.group(1).strip() if res_match else "Unknown",
                similarity=f"{99 - (idx * 3)}%", # Mock similarity
                date=datetime.now().strftime("%Y-%m-%d"),
                size=f"{(len(text)/1024):.1f}kb",
                impact="High",
                text=text
            ))
        
        return SearchResponse(
            status="success", 
            results=memories[:request.limit]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search incidents: {str(e)}")

@router.post("/analyze", response_model=AnalyzeResponse, summary="Analyze incidents")
def analyze_incident_endpoint(request: IncidentAnalyzeRequest):
    """
    Use Hindsight's reflect capability to analyze incidents based on a query.
    """
    try:
        insight = analyze_incident(request.query)
        return AnalyzeResponse(
            status="success",
            insight=insight
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze incidents: {str(e)}")
