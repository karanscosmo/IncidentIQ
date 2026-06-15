from hindsight_client import Hindsight
from app.core.config import settings

# Initialize Hindsight Client using settings from core config
client = Hindsight(
    base_url=settings.hindsight_base_url,
    api_key=settings.hindsight_api_key
)

def store_incident(content: str):
    """
    Stores an incident memory in the configured memory bank.
    """
    response = client.retain(
        bank_id=settings.hindsight_memory_bank, 
        content=content
    )
    return response

def search_incidents(query: str):
    """
    Retrieves similar incidents from the memory bank based on semantic query.
    """
    response = client.recall(
        bank_id=settings.hindsight_memory_bank, 
        query=query
    )
    return response.results

def analyze_incident(query: str):
    """
    Reflects on the memories in the bank to provide an analytical insight.
    """
    response = client.reflect(
        bank_id=settings.hindsight_memory_bank,
        query=query
    )
    # The SDK 'reflect' method usually returns an object with an 'answer' or 'insight' property
    # It might just be 'response.text' or 'response.answer' depending on SDK version.
    # Assuming it returns `.text` or `.answer` for the sake of standard response handling.
    return getattr(response, "answer", getattr(response, "text", str(response)))
