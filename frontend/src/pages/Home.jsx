import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [anime, setAnime] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnime();
  }, []);

  async function loadAnime() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/anime');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setAnime(data.data || []);
    } catch (e) {
      setError('Kon anime niet laden. Is de backend actief?');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return loadAnime();
    const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setAnime(data.data || []);
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Anime Overzicht</h1>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          style={styles.searchInput}
          placeholder="Zoek anime..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button style={styles.searchBtn} type="submit">Zoeken</button>
        {search && <button style={styles.clearBtn} type="button" onClick={() => { setSearch(''); loadAnime(); }}>✕</button>}
      </form>

      {loading ? (
        <p>Laden...</p>
      ) : error ? (
        <p style={{ color: '#e53e3e' }}>{error}</p>
      ) : anime.length === 0 ? (
        <p>Geen anime gevonden.</p>
      ) : (
        <div style={styles.grid}>
          {anime.map(a => (
            <Link key={a.id} to={`/anime/${a.id}`} style={styles.card}>
              <h3 style={styles.cardTitle}>{a.name}</h3>
              <p style={styles.cardSub}>{a.characters?.length ?? 0} characters</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  heading: { marginBottom: '1.5rem' },
  searchForm: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' },
  searchInput: { flex: 1, padding: '0.5rem', border: '1px solid #cbd5e0', borderRadius: '4px' },
  searchBtn: { padding: '0.5rem 1rem', background: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  clearBtn: { padding: '0.5rem', background: '#718096', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' },
  card: { background: 'white', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'inherit', display: 'block' },
  cardTitle: { margin: '0 0 0.5rem', fontSize: '1rem' },
  cardSub: { margin: 0, color: '#718096', fontSize: '0.85rem' },
};
