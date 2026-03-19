import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

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
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Registreren</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="auth-label">Gebruikersnaam</label>
          <input
            className="auth-input"
            type="text"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <label className="auth-label">E-mail</label>
          <input
            className="auth-input"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <label className="auth-label">Wachtwoord</label>
          <input
            className="auth-input"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="auth-button" disabled={loading}>
            {loading ? 'Bezig...' : 'Registreren'}
          </button>
        </form>
        <p className="auth-footer">
          Al een account? <Link to="/login">Inloggen</Link>
        </p>
      </div>
    </div>
  );
}
