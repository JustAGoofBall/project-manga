import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AnimeDetail() {
  const { id } = useParams();
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
    if (isFavorite) {
      await authFetch(`/api/favorites/${id}`, { method: 'DELETE' });
    } else {
      await authFetch(`/api/favorites/${id}`, { method: 'POST' });
    }
    setIsFavorite(!isFavorite);
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

  if (loading) return <div style={styles.page}>Laden...</div>;
  if (!anime) return <div style={styles.page}>Anime niet gevonden.</div>;

  const avg = ratings.length
    ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{anime.name}</h1>
          {avg && <p style={styles.avg}>⭐ Gemiddeld: {avg} / 10 ({ratings.length} reviews)</p>}
        </div>
        {user && (
          <button onClick={toggleFavorite} style={{ ...styles.favBtn, background: isFavorite ? '#e53e3e' : '#38a169' }}>
            {isFavorite ? '❤️ Verwijder favoriet' : '🤍 Toevoegen aan favorieten'}
          </button>
        )}
      </div>

      <section style={styles.section}>
        <h2>Characters ({characters.length})</h2>
        {characters.length === 0 ? <p>Geen characters.</p> : (
          <ul style={styles.list}>
            {characters.map(c => <li key={c.id} style={styles.listItem}>{c.name}</li>)}
          </ul>
        )}
      </section>

      <section style={styles.section}>
        <h2>Ratings</h2>

        {user && (
          <form onSubmit={handleRatingSubmit} style={styles.ratingForm}>
            <h3 style={{ marginTop: 0 }}>{myRating ? 'Jouw rating aanpassen' : 'Geef een rating'}</h3>
            {error && <p style={styles.error}>{error}</p>}
            <label style={styles.label}>Score (1-10)</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="10"
              value={ratingForm.rating}
              onChange={e => setRatingForm({ ...ratingForm, rating: e.target.value })}
              required
            />
            <label style={styles.label}>Review (optioneel)</label>
            <textarea
              style={{ ...styles.input, height: '80px' }}
              value={ratingForm.review}
              onChange={e => setRatingForm({ ...ratingForm, review: e.target.value })}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={styles.submitBtn} type="submit">
                {myRating ? 'Opslaan' : 'Plaatsen'}
              </button>
              {myRating && (
                <button type="button" onClick={handleDeleteRating} style={styles.deleteBtn}>
                  Verwijderen
                </button>
              )}
            </div>
          </form>
        )}

        {ratings.length === 0 ? <p>Nog geen ratings.</p> : (
          <div style={styles.ratingsList}>
            {ratings.map(r => (
              <div key={r.id} style={styles.ratingCard}>
                <strong>{r.username}</strong>
                <span style={styles.score}>⭐ {r.rating}/10</span>
                {r.review && <p style={styles.review}>{r.review}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { margin: 0 },
  avg: { color: '#718096', marginTop: '0.5rem' },
  favBtn: { color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' },
  section: { marginBottom: '2rem' },
  list: { listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  listItem: { background: '#ebf4ff', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem' },
  ratingForm: { background: 'white', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  label: { display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.9rem' },
  input: { display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.75rem', border: '1px solid #cbd5e0', borderRadius: '4px', boxSizing: 'border-box' },
  submitBtn: { padding: '0.5rem 1rem', background: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { padding: '0.5rem 1rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: '#e53e3e', fontSize: '0.85rem', marginBottom: '0.5rem' },
  ratingsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  ratingCard: { background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  score: { marginLeft: '0.75rem', color: '#d69e2e' },
  review: { margin: '0.5rem 0 0', color: '#4a5568', fontSize: '0.9rem' },
};
