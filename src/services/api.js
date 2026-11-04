// API client for Haru Resource Hub

const API_BASE = '/api';

export async function fetchAllData() {
  try {
    const res = await fetch(`${API_BASE}/data`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error, reading local fallback', err);
    const cached = localStorage.getItem('haru_resources_cache');
    if (cached) return JSON.parse(cached);
    throw err;
  }
}

export async function togglePin(id) {
  try {
    const res = await fetch(`${API_BASE}/toggle-pin/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle pin');
    return await res.json();
  } catch (err) {
    console.error('Toggle pin error:', err);
    throw err;
  }
}

export async function syncGoogleSheet() {
  const res = await fetch(`${API_BASE}/sync`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to sync');
  }
  return await res.json();
}

export async function createResource(type, data) {
  const res = await fetch(`${API_BASE}/resources/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Create failed');
  return await res.json();
}

export async function updateResource(type, id, data) {
  const res = await fetch(`${API_BASE}/resources/${type}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Update failed');
  return await res.json();
}

export async function deleteResource(type, id) {
  const res = await fetch(`${API_BASE}/resources/${type}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Delete failed');
  return await res.json();
}

