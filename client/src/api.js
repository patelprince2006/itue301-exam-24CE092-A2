// API Helper with automatic fallback to direct backend URL
const API_BASE = 'http://localhost:5000/api/v1';

export const apiFetch = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    // 1. Try relative path (Vite proxy)
    const res = await fetch(`/api/v1${cleanEndpoint}`, options);
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    // 2. Fallback to direct backend URL
    try {
      const fallbackRes = await fetch(`${API_BASE}${cleanEndpoint}`, options);
      if (!fallbackRes.ok) {
        const errorData = await fallbackRes.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${fallbackRes.status}`);
      }
      return await fallbackRes.json();
    } catch (directErr) {
      // 3. Fallback to 127.0.0.1
      const ipRes = await fetch(`http://127.0.0.1:5000/api/v1${cleanEndpoint}`, options);
      if (!ipRes.ok) {
        const errorData = await ipRes.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${ipRes.status}`);
      }
      return await ipRes.json();
    }
  }
};

export default API_BASE;
