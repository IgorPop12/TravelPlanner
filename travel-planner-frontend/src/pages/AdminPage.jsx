import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { userService } from '../services/userService';

const TRAVEL_BASE = import.meta.env.VITE_API_TRAVEL_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('Korisnici');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
    loadAllPlans();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      setError('Greška pri učitavanju korisnika.');
    } finally {
      setLoading(false);
    }
  };

  const loadAllPlans = async () => {
    try {
      const res = await fetch(`${TRAVEL_BASE}/api/travel-plans/all`, {
        headers: authHeaders()
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPlans(data);
    } catch {
      console.error('Greška pri učitavanju planova.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Obrisati korisnika i sve njegove planove?')) return;
    try {
      await userService.delete(id);
      loadUsers();
      loadAllPlans();
    } catch {
      alert('Greška pri brisanju korisnika.');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Obrisati plan?')) return;
    try {
      await fetch(`${TRAVEL_BASE}/api/travel-plans/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      loadAllPlans();
    } catch {
      alert('Greška pri brisanju plana.');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('sr-RS');

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Admin panel</h1>

        <div style={styles.tabs}>
          {['Korisnici', 'Svi planovi'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {activeTab === 'Korisnici' && (
          loading ? <p>Učitavanje...</p> : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Ime</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Uloga</th>
                  <th style={styles.th}>Registrovan</th>
                  <th style={styles.th}>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: user.role === 'admin' ? '#eef2ff' : '#f0fdf4',
                        color: user.role === 'admin' ? '#4f46e5' : '#059669'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>{formatDate(user.createdAt)}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDeleteUser(user.id)} style={styles.deleteBtn}>
                        Obriši
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {activeTab === 'Svi planovi' && (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Naziv</th>
                <th style={styles.th}>Period</th>
                <th style={styles.th}>Budžet</th>
                <th style={styles.th}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} style={styles.tr}>
                  <td style={styles.td}>{plan.name}</td>
                  <td style={styles.td}>
                    {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
                  </td>
                  <td style={styles.td}>€{plan.budget}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleDeletePlan(plan.id)} style={styles.deleteBtn}>
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' },
  tab: { padding: '0.6rem 1.2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', borderBottom: '2px solid transparent', marginBottom: '-2px' },
  activeTab: { color: '#4f46e5', borderBottom: '2px solid #4f46e5', fontWeight: 'bold' },
  error: { color: 'red' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  thead: { backgroundColor: '#f9fafb' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '0.75rem 1rem', fontSize: '0.95rem' },
  badge: { padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' },
  deleteBtn: { padding: '0.3rem 0.7rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
};