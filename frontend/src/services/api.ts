import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add an interceptor to inject API keys into headers
api.interceptors.request.use((config) => {
  const openaiKey = localStorage.getItem('openai_api_key');
  const hindsightKey = localStorage.getItem('hindsight_api_key');
  
  if (openaiKey) {
    config.headers['X-OpenAI-Key'] = openaiKey;
  }
  if (hindsightKey) {
    config.headers['X-Hindsight-Key'] = hindsightKey;
  }
  
  return config;
});

export const incidentService = {
  store: async (content: string) => {
    return api.post('/incident/store', { content })
  },
  search: async (query: string, limit = 5) => {
    return api.post('/incident/search', { query, limit })
  },
  analyze: async (query: string) => {
    return api.post('/incident/analyze', { query })
  }
}

export const deploymentService = {
  predictRisk: async (service: string, version: string, change_summary: string) => {
    return api.post('/predictor/risk', { service, version, change_summary })
  }
}

export const workflowService = {
  resolveIncident: async (incident_content: string) => {
    return api.post('/workflow/resolve', { incident_content })
  }
}
