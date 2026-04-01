import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AnimeDetail.css';

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();

  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratingForm, setRatingForm] = useState({ rating: '', review: '' });
  const [myRating, setMyRating] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, [id]);

  async function loadAll() {
    setLoading(true);
    const [animeRes, charRes, ratingRes] = await Promise.all([
      fetch(`/api/anime/${id}`),
      fetch(`/api/anime/${id}/characters`),
      fetch(`/api/anime/${id}/ratings`),
    ]);
    const [animeData, charData, ratingData] = await Promise.all([
      animeRes.json(), charRes.json(), ratingRes.json()
    ]);
    setAnime(animeData.data);
    setCharacters(charData.data || []);
    setRatings(ratingData.data || []);

    if (user) {
      const favRes = await authFetch('/api/favorites');
      const favData = await favRes.json();
      const favIds = (favData.data || []).map(f => f.anime_id);
      setIsFavorite(favIds.includes(Number(id)));

      const found = (ratingData.data || []).find(r => r.username === user.username);
      if (found) {
        setMyRating(found);
        setRatingForm({ rating: found.rating, review: found.review || '' });
      }
    }
    setLoading(false);
  }

  async function toggleFavorite() {
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await authFetch(`/api/favorites/${id}`, { method });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update favorites');
        return;
      }
      
      setIsFavorite(!isFavorite);
      setError('');
    } catch (err) {
      setError('Error updating favorites: ' + err.message);
    }
  }

  async function handleRatingSubmit(e) {
    e.preventDefault();
    setError('');
    const method = myRating ? 'PUT' : 'POST';
    const url = myRating
      ? `/api/anime/${id}/ratings/${myRating.id}`
      : `/api/anime/${id}/ratings`;
    const res = await authFetch(url, {
      method,
      body: JSON.stringify({ rating: Number(ratingForm.rating), review: ratingForm.review }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.message);
    loadAll();
  }

  async function handleDeleteRating() {
    await authFetch(`/api/anime/${id}/ratings/${myRating.id}`, { method: 'DELETE' });
    setMyRating(null);
    setRatingForm({ rating: '', review: '' });
    loadAll();
  }

  if (loading) return <div className="anime-detail-page">Laden...</div>;
  if (!anime) return <div className="anime-detail-page">Anime niet gevonden.</div>;

  const avg = ratings.length
    ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div className="anime-detail-page">
      <div className="anime-detail-header">
        <div>
          <button onClick={() => navigate(-1)} className="anime-detail-back-btn">← Terug</button>
          <h1 className="anime-detail-title">{anime.name}</h1>
          {avg && <p className="anime-detail-avg">⭐ Gemiddeld: {avg} / 10 ({ratings.length} reviews)</p>}
        </div>
        {user && (
          <div>
            <button onClick={toggleFavorite} className={`anime-detail-fav-btn ${isFavorite ? 'anime-detail-fav-btn-active' : 'anime-detail-fav-btn-inactive'}`}>
              {isFavorite ? '❤️ Verwijder favoriet' : '🤍 Toevoegen aan favorieten'}
            </button>
            {error && <p className="anime-detail-error">{error}</p>}
          </div>
        )}
      </div>

      <section className="anime-detail-section">
        <h2>Characters ({characters.length})</h2>
        {characters.length === 0 ? <p>Geen characters.</p> : (
          <ul className="anime-detail-list">
            {characters.map(c => <li key={c.id} className="anime-detail-list-item">{c.name}</li>)}
          </ul>
        )}
      </section>

      <section className="anime-detail-section">
        <h2>Ratings</h2>

        {user && (
          <form onSubmit={handleRatingSubmit} className="anime-detail-rating-form">
            <h3>{myRating ? 'Jouw rating aanpassen' : 'Geef een rating'}</h3>
            {error && <p className="anime-detail-error">{error}</p>}
            <label className="anime-detail-rating-form-label">Score (1-10)</label>
            <input
              className="anime-detail-rating-form-input"
              type="number"
              min="1"
              max="10"
              value={ratingForm.rating}
              onChange={e => setRatingForm({ ...ratingForm, rating: e.target.value })}
              required
            />
            <label className="anime-detail-rating-form-label">Review (optioneel)</label>
            <textarea
              className="anime-detail-rating-form-input anime-detail-rating-form-textarea"
              value={ratingForm.review}
              onChange={e => setRatingForm({ ...ratingForm, review: e.target.value })}
            />
            <div className="anime-detail-rating-btn-group">
              <button className="anime-detail-rating-submit-btn" type="submit">
                {myRating ? 'Opslaan' : 'Plaatsen'}
              </button>
              {myRating && (
                <button type="button" onClick={handleDeleteRating} className="anime-detail-rating-delete-btn">
                  Verwijderen
                </button>
              )}
            </div>
          </form>
        )}

        {ratings.length === 0 ? <p>Nog geen ratings.</p> : (
          <div className="anime-detail-ratings-list">
            {ratings.map(r => (
              <div key={r.id} className="anime-detail-rating-card">
                <strong>{r.username}</strong>
                <span className="anime-detail-rating-score">⭐ {r.rating}/10</span>
                {r.review && <p className="anime-detail-rating-review">{r.review}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
