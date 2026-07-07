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
  },

  // Dodaj ove metode u postojeći shareService objekat

  getChecklistByToken: async (planId, shareToken) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/checklist-items?token=${encodeURIComponent(shareToken)}`
    );
    if (!res.ok) throw new Error('Greška');
    return res.json();
  },

  createDestinationByToken: async (planId, shareToken, data) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/destinations?token=${encodeURIComponent(shareToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    if (!res.ok) throw new Error('Greška');
    return res.json();
  },

  deleteDestinationByToken: async (planId, shareToken, id) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/destinations/${id}?token=${encodeURIComponent(shareToken)}`,
      { method: 'DELETE' }
    );
    if (!res.ok) throw new Error('Greška');
  },

  createActivityByToken: async (planId, shareToken, data) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/activities?token=${encodeURIComponent(shareToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    if (!res.ok) throw new Error('Greška');
    return res.json();
  },

  deleteActivityByToken: async (planId, shareToken, id) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/activities/${id}?token=${encodeURIComponent(shareToken)}`,
      { method: 'DELETE' }
    );
    if (!res.ok) throw new Error('Greška');
  },

  createChecklistItemByToken: async (planId, shareToken, name) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/checklist-items?token=${encodeURIComponent(shareToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      }
    );
    if (!res.ok) throw new Error('Greška');
    return res.json();
  },

  toggleChecklistItemByToken: async (planId, shareToken, id) => {
    const res = await fetch(
      `${TRAVEL_BASE}/api/shared-access/plans/${planId}/checklist-items/${id}/toggle?token=${encodeURIComponent(shareToken)}`,
      { method: 'PATCH' }
    );
    if (!res.ok) throw new Error('Greška');
  }
};