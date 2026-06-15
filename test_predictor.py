from app.schemas.schemas import DeploymentRiskRequest
from app.services.risk.predictor_service import predict_deployment_risk

req = DeploymentRiskRequest(service="test", version="1", change_summary="test")
try:
    res = predict_deployment_risk(req)
    print(res)
except Exception as e:
    print("ERROR:", str(e))
