import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

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
    <div className="home-page">
      <h1 className="home-heading">Anime Overzicht</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          className="search-input"
          placeholder="Zoek anime..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="search-btn" type="submit">Zoeken</button>
        {search && <button className="clear-btn" type="button" onClick={() => { setSearch(''); loadAnime(); }}>✕</button>}
      </form>

      {loading ? (
        <p>Laden...</p>
      ) : error ? (
        <p className="text-error">{error}</p>
      ) : anime.length === 0 ? (
        <p>Geen anime gevonden.</p>
      ) : (
        <div className="anime-grid">
          {anime.map(a => (
            <Link key={a.id} to={`/anime/${a.id}`} className="anime-card">
              <h3 className="anime-card-title">{a.name}</h3>
              <p className="anime-card-subtitle">{a.characters?.length ?? 0} characters</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
