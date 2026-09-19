// API Helper configured with environment variable VITE_API_URL for Render deployment & local fallback
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiFetch = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const targetUrl = `${baseUrl}${cleanEndpoint}`;

  try {
    // 1. Try configured API base URL (VITE_API_URL or localhost:5000)
    const res = await fetch(targetUrl, options);
    if (res.ok) {
      return await res.json();
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Server responded with status ${res.status}`);
  } catch (err) {
    // 2. Try relative path (Vite dev proxy)
    try {
      const proxyRes = await fetch(`/api/v1${cleanEndpoint}`, options);
      if (proxyRes.ok) {
        return await proxyRes.json();
      }
      throw new Error(`HTTP ${proxyRes.status}`);
    } catch (proxyErr) {
      // 3. Fallback to direct 127.0.0.1
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
