import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Favorites.css';

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
    <div className="favorites-page">
      <h1 className="favorites-heading">Mijn Favorieten</h1>
      {loading ? (
        <p>Laden...</p>
      ) : favorites.length === 0 ? (
        <p>Je hebt nog geen favorieten. <Link to="/">Bekijk anime</Link></p>
      ) : (
        <div className="favorites-list">
          {favorites.map(f => (
            <div key={f.id} className="favorite-card">
              <Link to={`/anime/${f.anime_id}`} className="favorite-name">{f.anime_name}</Link>
              <button onClick={() => removeFavorite(f.anime_id)} className="favorite-remove-btn">
                ✕ Verwijderen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
