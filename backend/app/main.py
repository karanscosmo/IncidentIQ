from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import certifi
import logging

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='{"time": "%(asctime)s", "level": "%(levelname)s", "name": "%(name)s", "message": "%(message)s"}'
)

os.environ['SSL_CERT_FILE'] = certifi.where()
from app.core.config import settings
from app.api.routers import incidents, workflow, predictor

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="Production-grade API for storing, searching, and analyzing incident memories using Hindsight Cloud.",
    root_path="/_/backend"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://incidentiq.demo"
    ], # Production ready CORS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the incidents router under the /incident prefix
app.include_router(incidents.router, prefix="/incident", tags=["Incidents"])

# Include the workflow router
app.include_router(workflow.router, prefix="/workflow", tags=["Agent Workflow"])

from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import logging
    logging.error(f"Internal server error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "An internal server error occurred."}
    )

# Include the predictor router
app.include_router(predictor.router, prefix="/predictor", tags=["Deployment Risk Predictor"])

@app.get("/", summary="Health check", tags=["System"])
def health_check():
    """
    System health check endpoint.
    """
    return {"status": "ok", "message": f"{settings.api_title} is running."}
