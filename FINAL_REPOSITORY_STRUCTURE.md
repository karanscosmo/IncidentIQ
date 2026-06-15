# IncidentIQ Final Repository Structure

This repository has been fully restructured into a production-grade, enterprise-ready full-stack AI platform.

```
incidentiq/
├── backend/                  # FastAPI & LangGraph Backend
│   ├── requirements.txt      # Backend dependencies
│   ├── .env.example          # Safe template for Hindsight & OpenAI secrets
│   └── app/
│       ├── main.py           # Application entrypoint
│       ├── api/
│       │   └── routers/      # Refactored router modules (incidents, workflow, predictor)
│       ├── agents/           # Domain-specific LangGraph Agents
│       ├── services/
│       │   ├── hindsight/    # Hindsight Memory Bank Integration
│       │   ├── llm/          # OpenAI integrations
│       │   └── risk/         # Risk predictor services
│       ├── workflows/
│       │   └── langgraph/    # Workflow graphs, nodes, and state management
│       ├── schemas/          # Pydantic validation schemas
│       ├── core/
│       │   └── config/       # Pydantic Settings
│       └── utils/            # Shared utilities
├── frontend/                 # React + Vite + Tailwind Frontend
│   ├── index.html            # Vite entry
│   ├── package.json          # Frontend dependencies
│   └── src/
│       ├── main.tsx          # React DOM entry
│       ├── App.tsx           # React Router
│       ├── components/
│       │   ├── layout/       # Layout components
│       │   └── ui/           # Reusable UI primitives
│       ├── features/         # Domain-Driven Feature Modules
│       │   ├── dashboard/    # Dashboard feature
│       │   ├── incident/     # Incident Copilot & Similar Incidents
│       │   ├── memory/       # Memory Explorer
│       │   └── deployment/   # Deployment Risk Predictor
│       ├── services/         # API integration (api.ts)
│       └── styles/           # CSS modules (App.css)
├── docs/                     # Hackathon Deliverables & Documentation
│   ├── architecture.md       # LangGraph + Hindsight architecture
│   ├── api-reference.md      # API details
│   ├── demo-script.md        # 60-second pitch
│   └── hindsight_usage.md    # Memory integration evidence
├── scripts/                  # Automation & Data
│   └── seed_memories.py      # Expanded 20-incident Hindsight seed script
├── infra/                    # Deployment Infrastructure
│   ├── docker/
│   ├── railway/
│   └── vercel/
├── tests/                    # QA Test Suite
│   ├── backend/              # Pytest backend tests
│   └── frontend/             # Jest/Vitest frontend tests
└── .gitignore                # Global Git rules
```

**Status**: Verified. 
- All `node_modules`, `venv`, `dist`, `.DS_Store`, `.vscode`, and `__pycache__` temporary files have been permanently purged from version control tracking.
- The `.env` secret file has been purged and replaced with a safe `.env.example`.
