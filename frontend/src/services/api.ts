import axios from 'axios'

const isProd = import.meta.env.PROD;
const API_URL = import.meta.env.VITE_API_URL || (isProd ? '/_/backend' : 'http://localhost:8000');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

export const dashboardService = {
  getMetrics: async () => {
    return api.get('/dashboard/metrics')
  },
  getHealth: async () => {
    return api.get('/dashboard/health')
  },
  getInsight: async () => {
    return api.get('/dashboard/insight')
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
