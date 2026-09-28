/**
 * PAIMANA Sentinel AI - Enterprise API Client
 * Connects frontend views to the FastAPI backend with JWT tokens and seamless offline fallbacks.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
class ApiClient {
    token = null;
    constructor() {
        this.token = localStorage.getItem('paimana_access_token');
    }
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('paimana_access_token', token);
        }
        else {
            localStorage.removeItem('paimana_access_token');
        }
    }
    getToken() {
        return this.token;
    }
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
    // Auth
    async login(email, password) {
        const res = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.setToken(res.access_token);
        return res;
    }
    async getMe() {
        return this.request('/auth/me');
    }
    // Projects
    async getProjects(params = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
                searchParams.append(key, String(val));
            }
        });
        const qs = searchParams.toString();
        return this.request(`/projects${qs ? `?${qs}` : ''}`);
    }
    async getProjectDetail(projectId) {
        return this.request(`/projects/${projectId}`);
    }
    // Predictions & Explainable AI (SHAP)
    async getPrediction(projectId) {
        return this.request(`/predictions/${projectId}`);
    }
    // What-If Simulator
    async runSimulation(payload) {
        return this.request('/simulator/simulate', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }
    // Early Warnings & Alerts
    async getAlerts(params = {}) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
                searchParams.append(key, String(val));
            }
        });
        const qs = searchParams.toString();
        return this.request(`/alerts${qs ? `?${qs}` : ''}`);
    }
    async updateAlert(alertId, payload) {
        return this.request(`/alerts/${alertId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    }
    // Analytics Overview
    async getAnalyticsOverview() {
        return this.request('/analytics/overview');
    }
    // AI Assistant (RAG)
    async chatWithAssistant(messages, projectId) {
        return this.request('/assistant/chat', {
            method: 'POST',
            body: JSON.stringify({ messages, project_id: projectId }),
        });
    }
    // Models Benchmarking
    async getModelMetrics() {
        return this.request('/models/metrics');
    }
    // Data Ingestion & Import Workflow
    async getDataStatus() {
        return this.request('/data/status');
    }
    async downloadCufTemplate() {
        const res = await fetch(`${API_BASE_URL}/data/template`);
        if (!res.ok)
            throw new Error("Failed to download CUF template");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cuf_project_import_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
    async validateCufFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        const headers = {};
        if (this.token)
            headers['Authorization'] = `Bearer ${this.token}`;
        const res = await fetch(`${API_BASE_URL}/data/validate`, {
            method: 'POST',
            headers,
            body: formData
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to validate CUF file');
        }
        return res.json();
    }
    async importCufFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        const headers = {};
        if (this.token)
            headers['Authorization'] = `Bearer ${this.token}`;
        const res = await fetch(`${API_BASE_URL}/data/import`, {
            method: 'POST',
            headers,
            body: formData
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || 'Failed to import CUF file');
        }
        return res.json();
    }
    async createProject(projectData) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    }
    async updateProject(projectId, projectData) {
        return this.request(`/projects/${projectId}`, {
            method: 'PATCH',
            body: JSON.stringify(projectData),
        });
    }
    // Admin Health
    async getSystemHealth() {
        return this.request('/admin/system-health');
    }
}
export const apiClient = new ApiClient();
