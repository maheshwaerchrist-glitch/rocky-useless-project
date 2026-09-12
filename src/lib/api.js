const API_BASE_URL = (process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }

    return response.json();
}

export function checkBackend() {
    return request('/api/');
}

export function createStatusCheck(clientName) {
    return request('/api/status', {
        method: 'POST',
        body: JSON.stringify({ client_name: clientName }),
    });
}

export function getStatusChecks() {
    return request('/api/status');
}

export { API_BASE_URL };
