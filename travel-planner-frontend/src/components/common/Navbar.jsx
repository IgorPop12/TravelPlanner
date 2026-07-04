import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>✈ TravelPlanner</Link>
      <div style={styles.right}>
        {isAdmin && <Link to="/admin" style={styles.link}>Admin</Link>}
        <span style={styles.user}>{user?.name}</span>
        <button onClick={handleLogout} style={styles.button}>Odjavi se</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#4f46e5', color: 'white' },
  logo: { color: 'white', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 'bold' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  link: { color: 'white', textDecoration: 'none' },
  user: { opacity: 0.85 },
  button: { padding: '0.4rem 1rem', backgroundColor: 'white', color: '#4f46e5', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};