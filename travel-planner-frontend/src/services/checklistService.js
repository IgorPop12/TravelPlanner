const BASE = import.meta.env.VITE_API_TRAVEL_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const checklistService = {
  getAll: async (planId) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/checklist-items`, { headers: authHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  create: async (planId, name) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/checklist-items`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  toggle: async (planId, id) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/checklist-items/${id}/toggle`, {
      method: 'PATCH',
      headers: authHeaders()
    });
    if (!res.ok) throw await res.json();
  },

  delete: async (planId, id) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/checklist-items/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw await res.json();
  }
};