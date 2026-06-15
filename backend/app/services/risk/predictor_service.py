from openai import OpenAI
from app.core.config import settings
from app.services.hindsight.hindsight_service import search_incidents
from app.schemas.schemas import DeploymentRiskRequest, DeploymentRiskResponse

# Initialize OpenAI Client
client = OpenAI(api_key=settings.openai_api_key)
MODEL = "gpt-4o-mini"

def predict_deployment_risk(request: DeploymentRiskRequest) -> DeploymentRiskResponse:
    """
    Predicts deployment risk based on service, version, change summary, 
    and historical incidents retrieved from Hindsight.
    """
    # 1. Retrieve Context
    query = f"service: {request.service}, changes: {request.change_summary}"
    results = search_incidents(query)
    
    # Format retrieved memories
    historical_incidents = [m.text for m in results[:5]] # take top 5
    historical_context = "\n- ".join(historical_incidents) if historical_incidents else "No similar historical incidents found."

    # 2. Evaluate Risk using OpenAI Structured Outputs
    system_prompt = (
        "You are an expert SRE. Evaluate the deployment risk based on the proposed changes "
        "and past similar incidents. Assign a risk score (Low, Medium, High), a confidence level (Low, Medium, High), "
        "list the similar incidents that influenced your decision, and provide actionable recommended precautions."
    )
    
    user_prompt = (
        f"Service: {request.service}\n"
        f"Version: {request.version}\n"
        f"Change Summary: {request.change_summary}\n\n"
        f"Historical Incidents Context:\n- {historical_context}"
    )

    try:
        response = client.beta.chat.completions.parse(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format=DeploymentRiskResponse,
        )
        return response.choices[0].message.parsed
    except Exception as e:
        print(f"OpenAI API failed (Quota/Auth): {e}")
        # Fallback for demo so it doesn't crash
        return DeploymentRiskResponse(
            risk_score="Medium (Demo Mode Fallback)",
            confidence="Medium",
            similar_incidents=[
                "INC-502: Previous deployment caused elevated memory usage",
                "INC-410: Similar config change resulted in connection timeouts"
            ],
            recommended_precautions=[
                "Monitor memory usage closely after deployment",
                "Stagger rollout to 10% of traffic initially",
                "Ensure rollback strategy is tested and ready"
            ]
        )
