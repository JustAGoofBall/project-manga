import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Registratie mislukt');
      saveAuth(data.data.token, data.data.user);
      navigate('/');
    } catch {
      setError('Verbinding mislukt');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registreren</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Gebruikersnaam</label>
          <input
            style={styles.input}
            type="text"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <label style={styles.label}>E-mail</label>
          <input
            style={styles.input}
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <label style={styles.label}>Wachtwoord</label>
          <input
            style={styles.input}
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={styles.button} disabled={loading}>
            {loading ? 'Bezig...' : 'Registreren'}
          </button>
        </form>
        <p style={styles.footer}>
          Al een account? <Link to="/login">Inloggen</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '3rem 1rem' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { marginBottom: '1.5rem', textAlign: 'center' },
  error: { color: '#e53e3e', marginBottom: '1rem', fontSize: '0.9rem' },
  label: { display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem' },
  input: { display: 'block', width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #cbd5e0', borderRadius: '4px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '0.6rem', background: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' },
  footer: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
};
