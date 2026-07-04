const BASE = import.meta.env.VITE_API_TRAVEL_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const destinationService = {
  getAll: async (planId) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/destinations`, { headers: authHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  create: async (planId, data) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/destinations`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  update: async (planId, id, data) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/destinations/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
  },

  delete: async (planId, id) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/destinations/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw await res.json();
  }
};