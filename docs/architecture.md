# IncidentIQ Architecture

## 1. System Overview
IncidentIQ is built on a modern, event-driven architecture designed to act as an SRE copilot. It natively integrates with Hindsight Cloud for persistent vector memory and OpenAI for intelligent reasoning.

### Core Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI (Python 3.13)
- **Agent Orchestration**: LangGraph
- **Memory Store**: Vectorize Hindsight API (`incidentiq-prod` memory bank)
- **LLM Engine**: OpenAI `gpt-4o-mini`

## 2. Component Design

### 2.1 The Hindsight Integration Layer
`app/services/hindsight_service.py` acts as the bridge between our system and Vectorize. It encapsulates the `Hindsight` client, exposing simple interfaces:
- `store_incident(content: str)`: Pushes raw incident postmortems into the memory bank.
- `search_incidents(query: str, limit: int)`: Queries the memory bank for semantic matches to current anomalous logs.
- `analyze_incident(query: str)`: A direct query-and-summarize feature.

### 2.2 The LangGraph Copilot Workflow
The core intelligence lives in `app/agents/graph.py` and `app/agents/nodes.py`. When a user submits an anomalous log, the state graph executes:
1. **Analyze Node**: Extracts key entities (services, error codes, traces) from the raw input.
2. **Retrieve Memories Node**: Semantically queries Hindsight using the extracted entities to find historically similar outages.
3. **Generate Root Cause Node**: Synthesizes the retrieved memories and the current log to deduce the most probable root cause.
4. **Generate Resolution Node**: Proposes an actionable resolution based on the historical context.
5. **Generate Postmortem Node**: Drafts a structured postmortem for the current incident.
6. **Store Learning Node**: Writes the newly generated postmortem back into Hindsight, closing the continuous learning loop.

### 2.3 The Deployment Risk Predictor
An isolated service (`app/services/predictor_service.py`) that uses OpenAI's Structured Outputs to evaluate a proposed deployment manifest (service, version, changes) against historical incidents from Hindsight to assign a Risk Score and Confidence level.

## 3. Data Flow Example (Incident Resolution)
1. **User Input**: "auth-service is crashing with max_connections reached"
2. **FastAPI Route**: `POST /workflow/resolve`
3. **LangGraph**: Begins traversal.
4. **Hindsight Query**: Searches `auth-service max_connections`.
5. **Hindsight Result**: Returns `INC-102: DB Connection pool exhaustion`.
6. **LLM Synthesis**: Recognizes the similarity and recommends scaling PgBouncer.
7. **Response**: JSON payload returned to the React frontend.
8. **UI Render**: The Copilot explicit displays `INC-102` as the influencing memory in a structured panel.
