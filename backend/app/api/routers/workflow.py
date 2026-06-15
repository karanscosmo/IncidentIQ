from fastapi import APIRouter, HTTPException
from app.schemas.schemas import WorkflowRequest, WorkflowResponse
from app.workflows.langgraph.graph import incident_workflow

router = APIRouter()

@router.post("/resolve", response_model=WorkflowResponse, summary="Resolve incident using Agent Workflow")
def resolve_incident_endpoint(request: WorkflowRequest):
    """
    Triggers the LangGraph workflow to process an incident automatically.
    """
    try:
        # Initialize state with the incident content
        initial_state = {"incident_content": request.incident_content}
        
        # Run the workflow
        print(f"Triggering workflow for incident: {request.incident_content}")
        final_state = incident_workflow.invoke(initial_state)
        
        return WorkflowResponse(
            status="success",
            state=final_state
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Workflow execution failed: {str(e)}")
