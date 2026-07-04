const BASE = import.meta.env.VITE_API_EXPENSE_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const expenseService = {
  getAll: async (planId) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/expenses`, { headers: authHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  getSummary: async (planId) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/expenses/summary`, { headers: authHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  create: async (planId, data) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/expenses`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  update: async (planId, id, data) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/expenses/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
  },

  delete: async (planId, id) => {
    const res = await fetch(`${BASE}/api/travel-plans/${planId}/expenses/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw await res.json();
  }
};