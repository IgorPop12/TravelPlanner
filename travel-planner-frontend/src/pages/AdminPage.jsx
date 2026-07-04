import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';

const BASE = import.meta.env.VITE_API_USER_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch(`${BASE}/api/users`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data);
    } catch {
      setError('Greška pri učitavanju korisnika.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Obrisati korisnika?')) return;
    try {
      const res = await fetch(`${BASE}/api/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      if (!res.ok) throw new Error();
      loadUsers();
    } catch {
      alert('Greška pri brisanju korisnika.');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('sr-RS');

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Admin panel</h1>
        <h2 style={styles.subtitle}>Upravljanje korisnicima</h2>

        {error && <p style={styles.error}>{error}</p>}

        {loading ? (
          <p>Učitavanje...</p>
        ) : (
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
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={styles.deleteBtn}
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length === 0 && (
          <p style={styles.empty}>Nema korisnika.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  subtitle: { color: '#6b7280', fontWeight: 'normal', marginBottom: '1.5rem' },
  error: { color: 'red' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  thead: { backgroundColor: '#f9fafb' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '0.75rem 1rem', fontSize: '0.95rem' },
  badge: { padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' },
  deleteBtn: { padding: '0.3rem 0.7rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  empty: { textAlign: 'center', color: '#6b7280', padding: '2rem' }
};