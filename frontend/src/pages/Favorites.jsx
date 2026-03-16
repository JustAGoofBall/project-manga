import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setLoading(true);
    const res = await authFetch('/api/favorites');
    const data = await res.json();
    setFavorites(data.data || []);
    setLoading(false);
  }

  async function removeFavorite(animeId) {
    await authFetch(`/api/favorites/${animeId}`, { method: 'DELETE' });
    setFavorites(prev => prev.filter(f => f.anime_id !== animeId));
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Mijn Favorieten</h1>
      {loading ? (
        <p>Laden...</p>
      ) : favorites.length === 0 ? (
        <p>Je hebt nog geen favorieten. <Link to="/">Bekijk anime</Link></p>
      ) : (
        <div style={styles.list}>
          {favorites.map(f => (
            <div key={f.id} style={styles.card}>
              <Link to={`/anime/${f.anime_id}`} style={styles.name}>{f.anime_name}</Link>
              <button onClick={() => removeFavorite(f.anime_id)} style={styles.removeBtn}>
                ✕ Verwijderen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' },
  heading: { marginBottom: '1.5rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1rem 1.25rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  name: { fontWeight: '500', textDecoration: 'none', color: '#2d3748', fontSize: '1rem' },
  removeBtn: { background: '#e53e3e', color: 'white', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
};
