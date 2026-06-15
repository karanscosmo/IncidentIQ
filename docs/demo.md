# IncidentIQ - 60 Second Demo Script

## The Hook (0:00 - 0:15)
"Hi Judges, this is IncidentIQ. It's an AI SRE Copilot, but we didn't build just another chatbot. The entire product is built around **Vectorize Hindsight Memory**.
Most AI tools forget yesterday's outage. IncidentIQ explicitly remembers them and uses that exact historical context to solve today's downtime faster."

## The Proof of Memory (0:15 - 0:30)
*(Navigate to Memory Explorer)*
"First, let me prove the memory exists. This is our Memory Explorer, fetching live semantic vectors straight from the Hindsight `incidentiq-prod` bank. You can see we have 20 diverse, historically seeded incidents ranging from Redis OOMs to Kubernetes scaling failures. Hindsight natively manages all of these."

## The Live Incident (0:30 - 0:50)
*(Navigate to Incident Copilot)*
"Let's see it in action. I'm going to paste a vague log snippet:
`Process exiting with code 137. API Gateway container restarting repeatedly.`

*(Hit Send)*

Instead of a generic 'check your memory limits', watch the UI. Our LangGraph workflow just queried Hindsight, retrieved **INC-405** (a specific JWT memory leak we had 4 days ago), and used that specific resolution to formulate the answer. 

You can visibly see the exact Memory ID, the Root Cause, and the 99% Confidence score rendered right here in the panel."

## The Kicker (0:50 - 1:00)
*(Navigate to Deployment Risk)*
"And because Hindsight gives us an endless, searchable timeline of failures, we can proactively predict risk. If I submit a PR diff updating our JWT library, the Deployment Risk Predictor warns me *before* I merge, citing that exact historical outage.

IncidentIQ doesn't just guess; it remembers. Thank you."
