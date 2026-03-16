import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🎌 Anime API</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Anime</Link>
        {user ? (
          <>
            <Link to="/favorites" style={styles.link}>Mijn Favorieten</Link>
            {user.is_admin && <span style={styles.adminBadge}>👑 Admin</span>}
            <span style={styles.username}>👤 {user.username}</span>
            <button onClick={handleLogout} style={styles.button}>Uitloggen</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Inloggen</Link>
            <Link to="/register" style={styles.link}>Registreren</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1a1a2e',
    color: 'white',
  },
  brand: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: '#a0aec0',
    textDecoration: 'none',
  },
  username: {
    color: '#68d391',
    fontSize: '0.9rem',
  },
  adminBadge: {
    background: '#d4a574',
    color: '#1a1a2e',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
  },
  button: {
    background: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
