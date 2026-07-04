const BASE = import.meta.env.VITE_API_USER_URL;
const TRAVEL_BASE = import.meta.env.VITE_API_TRAVEL_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const shareService = {
  generateToken: async (planId, accessType) => {
    const res = await fetch(`${BASE}/api/shared-plans/tokens`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ planId, accessType })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  validateToken: async (token) => {
    const res = await fetch(`${BASE}/api/shared-plans/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  getPlanByToken: async (planId, shareToken) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}?token=${encodeURIComponent(shareToken)}`
    );
    if (!res.ok) throw new Error('Greška');
    return res.json();
  },

  getDestinationsByToken: async (planId, shareToken) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/destinations?token=${encodeURIComponent(shareToken)}`
    );
    if (!res.ok) throw new Error('Greška');
    return res.json();
  },

  getActivitiesByToken: async (planId, shareToken) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/activities?token=${encodeURIComponent(shareToken)}`
    );
    if (!res.ok) throw new Error('Greška');
    return res.json();
  }
};