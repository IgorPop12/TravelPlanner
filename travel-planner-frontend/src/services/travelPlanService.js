const BASE = import.meta.env.VITE_API_TRAVEL_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const travelPlanService = {
  getAll: async () => {
    const res = await fetch(`${BASE}/api/travel-plans`, { headers: authHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${BASE}/api/travel-plans/${id}`, { headers: authHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${BASE}/api/travel-plans`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE}/api/travel-plans/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE}/api/travel-plans/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw await res.json();
  }
};