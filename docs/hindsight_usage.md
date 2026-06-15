# Hindsight Integration Deep Dive

IncidentIQ is deeply coupled with Vectorize Hindsight to provide an intelligent, memory-driven SRE experience. We bypass basic, stateless LLM wrappers by injecting memory at every crucial step of the triage workflow.

## 1. How Memory is Stored (`client.retain`)

Whenever a new incident is resolved, or when the system is seeded (`seed_hindsight.py`), we serialize the incident into a structured text block and push it into the `incidentiq-prod` memory bank via the Hindsight API.

```python
# app/services/hindsight_service.py
def store_incident(content: str):
    return client.retain(content)
```
Vectorize automatically generates the embeddings and indexes the incident in the backend vector store, instantly making it available for semantic retrieval.

## 2. How Memory is Retrieved (`client.recall`)

When an SRE submits a vague alert or log snippet, we don't just send it to an LLM. We first query the Hindsight API to fetch the most semantically similar past events.

```python
# app/services/hindsight_service.py
def search_incidents(query: str, limit: int = 5):
    return client.recall(query, limit=limit)
```
These results form the contextual foundation for our LangGraph nodes. If a new deployment fails with a `Connection pool exhaustion` error, `client.recall` instantly pulls up `INC-102` which occurred 3 months ago under similar circumstances.

## 3. How Memory Influences the Output

The retrieved memories are injected into the LangGraph state under the `memories_retrieved` key. The subsequent LLM nodes (Root Cause, Resolution) are strictly prompted to synthesize their answers based *primarily* on these retrieved memories.

```python
# app/agents/nodes.py
prompt = f"Use these specific historical memories to diagnose the issue:\n{memories_context}\n\nCurrent Issue: {state.incident_content}"
```

### Visual Proof of Influence
We guarantee the memory influenced the output by exposing the memory metadata directly in the React frontend.
When the `Copilot.tsx` component receives a response, it parses the `memories_retrieved` array and renders a **"Found Similar Incidents in Memory"** panel explicitly highlighting:
- The exact **Incident ID** that Hindsight recalled
- The historical **Root Cause**
- The historical **Resolution**
- The **Confidence** score of the vector match

## 4. Continuous Learning (The Feedback Loop)

The most critical feature of IncidentIQ is that it learns over time. The final node in our LangGraph workflow is the `store_learning_node`. 

```python
# app/agents/nodes.py
def store_learning_node(state: IncidentState):
    store_incident(state.postmortem)
    return state
```
Once the AI deduces a root cause and proposes a resolution, it drafts a formalized postmortem and natively loops it back into `client.retain`. The next time a similar incident occurs, the memory bank is already smarter.
