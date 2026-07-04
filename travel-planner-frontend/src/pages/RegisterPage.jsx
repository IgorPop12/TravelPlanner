import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.register(name, email, password);
      login(response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Greška pri registraciji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registracija</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Ime</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label>Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Registracija...' : 'Registruj se'}
          </button>
        </form>
        <p style={styles.link}>
          Već imaš račun? <Link to="/login">Prijavi se</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '1.5rem' },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center' },
  field: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' },
  input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' },
  button: { width: '100%', padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  link: { textAlign: 'center', marginTop: '1rem' }
};