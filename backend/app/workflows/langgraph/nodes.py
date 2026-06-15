import os
from openai import OpenAI
from app.workflows.langgraph.state import IncidentState
from app.services.hindsight.hindsight_service import search_incidents, store_incident
from app.core.config import settings

# Initialize OpenAI Client
client = OpenAI(api_key=settings.openai_api_key)

MODEL = "gpt-4o-mini"

def analyze_node(state: IncidentState) -> IncidentState:
    print("Agent: Analyzing incident...")
    incident = state.get("incident_content", "")
    
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert SRE. Analyze the incident and provide a concise summary of the failure domain."},
            {"role": "user", "content": f"Incident: {incident}"}
        ]
    )
    analysis = response.choices[0].message.content
    return {"analysis": analysis}

import re

def retrieve_memories_node(state: IncidentState) -> IncidentState:
    print("Agent: Retrieving memories from Hindsight...")
    analysis = state.get("analysis", "")
    
    # We use the analysis as the query to find similar incidents
    results = search_incidents(analysis)
    memories = [m.text for m in results]
    
    memories_retrieved = []
    for idx, text in enumerate(memories):
        # Extract fields using regex for structured frontend response
        id_match = re.search(r'Incident(?: Summary)?:\s*([\w\s-]+?)\n', text, re.IGNORECASE)
        rc_match = re.search(r'Root Cause:\s*(.+?)(?=\n|$)', text, re.IGNORECASE)
        res_match = re.search(r'Resolution:\s*(.+?)(?=\n|$)', text, re.IGNORECASE)
        
        memories_retrieved.append({
            "id": id_match.group(1).strip() if id_match else f"INC-MEMORY-{idx}",
            "rootCause": rc_match.group(1).strip() if rc_match else "Unknown",
            "resolution": res_match.group(1).strip() if res_match else "Unknown",
            "confidence": 99 - (idx * 3), # Mock confidence since SDK might not return distance
            "text": text
        })
    
    return {"memories": memories, "memories_retrieved": memories_retrieved}

def generate_root_cause_node(state: IncidentState) -> IncidentState:
    print("Agent: Generating root cause...")
    incident = state.get("incident_content", "")
    analysis = state.get("analysis", "")
    memories = state.get("memories", [])
    
    context = "\n".join(memories) if memories else "No relevant past incidents found."
    
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert SRE. Determine the root cause of the incident based on the analysis and past similar incidents. Be specific and technical."},
            {"role": "user", "content": f"Incident: {incident}\nAnalysis: {analysis}\nPast Context:\n{context}"}
        ]
    )
    root_cause = response.choices[0].message.content
    return {"root_cause": root_cause}

def generate_resolution_node(state: IncidentState) -> IncidentState:
    print("Agent: Generating resolution...")
    root_cause = state.get("root_cause", "")
    
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert SRE. Provide step-by-step resolution actions to fix the given root cause."},
            {"role": "user", "content": f"Root Cause: {root_cause}"}
        ]
    )
    resolution = response.choices[0].message.content
    return {"resolution": resolution}

def generate_postmortem_node(state: IncidentState) -> IncidentState:
    print("Agent: Generating postmortem...")
    incident = state.get("incident_content", "")
    root_cause = state.get("root_cause", "")
    resolution = state.get("resolution", "")
    
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert SRE. Generate a blameless postmortem based on the incident, root cause, and resolution provided. Include sections for timeline, impact, root cause, resolution, and action items."},
            {"role": "user", "content": f"Incident: {incident}\nRoot Cause: {root_cause}\nResolution: {resolution}"}
        ]
    )
    postmortem = response.choices[0].message.content
    return {"postmortem": postmortem}

def store_learning_node(state: IncidentState) -> IncidentState:
    print("Agent: Storing learnings...")
    incident = state.get("incident_content", "")
    root_cause = state.get("root_cause", "")
    resolution = state.get("resolution", "")
    
    # Synthesize the final learning
    learning_content = f"Incident Summary: {incident}\nRoot Cause: {root_cause}\nResolution: {resolution}"
    
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "Summarize the incident, root cause, and resolution into a single concise fact for long-term memory storage."},
            {"role": "user", "content": learning_content}
        ]
    )
    learning = response.choices[0].message.content
    
    # Store in Hindsight Memory Bank
    store_incident(learning)
    
    return {"learning": learning}
