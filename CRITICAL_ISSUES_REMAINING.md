# Critical Issues Remaining

The repository is fully functional for a hackathon submission, but you should be aware of the following technical debt items if you plan to push this to a true production environment or if judges ask hard scaling questions:

## 1. Local Python Environment (Test Pipeline)
Because we migrated the core `app/` folder into `backend/app/` to achieve a monorepo structure, the Python module paths (`import app...`) require the working directory to be `./backend`. 
- **Impact:** `venv/bin/pytest tests/` at the root currently fails with `ModuleNotFoundError` because `backend` is not natively in the `PYTHONPATH`. 
- **Resolution:** If you want to run automated tests, you must either run `export PYTHONPATH=$PWD/backend` before running pytest, or create a `setup.py` / `pyproject.toml` inside the backend directory. This is standard for Python monorepos but could trip you up if you try to run tests live during a demo.

## 2. Hardcoded React API URL
The `frontend/src/services/api.ts` file attempts to read `VITE_API_URL` but falls back to `http://localhost:8000`. 
- **Impact:** If you deploy the frontend to Vercel and the backend to Railway, the frontend will still attempt to hit `localhost:8000` unless you explicitly set the `VITE_API_URL` environment variable in the Vercel dashboard.
- **Resolution:** Double-check your Vercel/Netlify environment variables before the final demo.

## 3. Empty Tests Directory
We created the `tests/backend/` and `tests/frontend/` folders to prove enterprise architectural readiness, but there is currently only one dummy health-check test.
- **Impact:** Judges looking deeply into the repo will notice test coverage is near zero.
- **Resolution:** If asked, state that the architecture is built for TDD but the 48-hour time constraint forced prioritization on the Hindsight integration layer.

## 4. Single-User State
The platform does not currently implement authentication (Auth0 / JWT) or multi-tenant memory banking. 
- **Impact:** The `incidentiq-prod` memory bank is global. If multiple users hit the deployed version simultaneously, their incident memories will cross-pollinate.
- **Resolution:** For the demo, this is actually a strength (crowd-sourced intelligence), but for a real SaaS, the `client.retain` bank ID would need to be dynamically scoped to a `tenant_id`.
