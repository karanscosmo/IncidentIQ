from fastapi import APIRouter, HTTPException
from app.schemas.schemas import DeploymentRiskRequest, DeploymentRiskResponse
from app.services.risk.predictor_service import predict_deployment_risk

router = APIRouter()

@router.post("/risk", response_model=DeploymentRiskResponse, summary="Predict Deployment Risk")
def predict_risk_endpoint(request: DeploymentRiskRequest):
    """
    Evaluates the risk of a proposed deployment by correlating the 
    service and changes against historical incidents in the memory bank.
    """
    try:
        response = predict_deployment_risk(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk prediction failed: {str(e)}")
