const BASE = import.meta.env.VITE_API_USER_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const userService = {
  getAll: async () => {
    const res = await fetch(`${BASE}/api/users`, { headers: authHeaders() });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE}/api/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw await res.json();
  }
};