import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  // Users state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');

  // Characters state
  const [animes, setAnimes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [characterSearch, setCharacterSearch] = useState('');
  const [selectedAnimeId, setSelectedAnimeId] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [editingCharacterId, setEditingCharacterId] = useState(null);
  const [editingCharacterName, setEditingCharacterName] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!user || !user.is_admin) {
      navigate('/');
      return;
    }
    loadUsers();
    loadAnimes();
    loadCharacters();
  }, [user, navigate]);

  useEffect(() => {
    // Filter users based on search
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredUsers(
        users.filter(u =>
          u.username.toLowerCase().includes(lowerSearch) ||
          u.email.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search, users]);

  useEffect(() => {
    // Filter characters based on search
    let filtered = characters;
    if (selectedAnimeId) {
      filtered = filtered.filter(c => c.anime_id === parseInt(selectedAnimeId));
    }
    if (characterSearch.trim()) {
      const lowerSearch = characterSearch.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(lowerSearch));
    }
    setFilteredCharacters(filtered);
  }, [characterSearch, characters, selectedAnimeId]);

  async function loadUsers() {
    try {
      const res = await authFetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.data || []);
      setError('');
    } catch (e) {
      setError('Kon users niet laden: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAnimes() {
    try {
      const res = await authFetch('/api/anime');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAnimes(data.data || []);
    } catch (e) {
      console.error('Error loading animes:', e.message);
    }
  }

  async function loadCharacters() {
    try {
      const res = await authFetch('/api/anime');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Load all characters from all animes
      const allCharacters = [];
      for (const anime of (data.data || [])) {
        const charRes = await authFetch(`/api/anime/${anime.id}/characters`);
        const charData = await charRes.json();
        if (charRes.ok && charData.data) {
          charData.data.forEach(char => {
            allCharacters.push({
              ...char,
              anime_name: anime.name,
              anime_id: anime.id
            });
          });
        }
      }
      setCharacters(allCharacters);
    } catch (e) {
      console.error('Error loading characters:', e.message);
    }
  }

  async function addCharacter() {
    if (!selectedAnimeId || !characterName.trim()) {
      setError('Selecteer een anime en voer een karakternaam in');
      return;
    }

    setError('');
    setSuccess('');
    try {
      const res = await authFetch(`/api/anime/${selectedAnimeId}/characters`, {
        method: 'POST',
        body: JSON.stringify({ name: characterName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess('Karakter toegevoegd');
      setCharacterName('');
      loadCharacters();
    } catch (e) {
      setError(e.message);
    }
  }

  async function updateCharacter(characterId, animeId) {
    if (!editingCharacterName.trim()) {
      setError('Voer een karakternaam in');
      return;
    }

    setError('');
    setSuccess('');
    try {
      const res = await authFetch(`/api/anime/${animeId}/characters/${characterId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editingCharacterName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess('Karakter bijgewerkt');
      setEditingCharacterId(null);
      setEditingCharacterName('');
      loadCharacters();
    } catch (e) {
      setError(e.message);
    }
  }

  async function deleteCharacter(characterId, animeId, characterName) {
    if (!window.confirm(`Weet je zeker dat je ${characterName} wilt verwijderen?`)) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const res = await authFetch(`/api/anime/${animeId}/characters/${characterId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(`${characterName} is verwijderd`);
      loadCharacters();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleAdmin(userId, currentStatus) {
    setError('');
    setSuccess('');
    try {
      const res = await authFetch(`/api/admin/users/${userId}/admin`, {
        method: 'PUT',
        body: JSON.stringify({ is_admin: !currentStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(currentStatus ? 'Admin status verwijderd' : 'Admin status gegeven');
      loadUsers();
    } catch (e) {
      setError(e.message);
    }
  }

  async function deleteUser(userId, username) {
    if (!window.confirm(`Weet je zeker dat je ${username} wilt verwijderen? Dit kan niet ongedaan gemaakt worden.`)) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const res = await authFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(`${username} is verwijderd`);
      loadUsers();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!user?.is_admin) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">👑 Admin Panel</h1>
        <p className="admin-subtitle">Beheer users en content</p>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      <div className="admin-section">
        <h2 className="admin-section-title">👥 Users Beheren</h2>

        <div className="admin-search-container">
          <input
            type="text"
            placeholder="Zoek users op naam of email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          <span className="admin-result-count">
            {filteredUsers.length} van {users.length} users
          </span>
        </div>

        {loading ? (
          <p>Laden...</p>
        ) : users.length === 0 ? (
          <p>Geen users gevonden.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr className="admin-table-header">
                  <th className="admin-table-th">Gebruiker</th>
                  <th className="admin-table-th">Email</th>
                  <th className="admin-table-th">Status</th>
                  <th className="admin-table-th">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className="admin-table-row">
                    <td className="admin-table-td">
                      <strong>{u.username}</strong>
                      {u.id === user.id && <span className="admin-badge"> (Jij)</span>}
                    </td>
                    <td className="admin-table-td">{u.email}</td>
                    <td className="admin-table-td">
                      {u.is_admin ? (
                        <span className="admin-badge">👑 Admin</span>
                      ) : (
                        <span className="admin-badge">👤 User</span>
                      )}
                    </td>
                    <td className="admin-table-td">
                      {u.id !== user.id && (
                        <div className="admin-button-group">
                          <button
                            onClick={() => toggleAdmin(u.id, u.is_admin)}
                            className={u.is_admin ? 'admin-remove-admin-btn' : 'admin-make-admin-btn'}
                          >
                            {u.is_admin ? 'Admin verwijderen' : 'Admin maken'}
                          </button>
                          <button
                            onClick={() => deleteUser(u.id, u.username)}
                            className="admin-delete-btn"
                          >
                            Verwijderen
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">🎭 Karakters Beheren</h2>

        <div className="admin-add-form">
          <h3 className="admin-form-title">Nieuw Karakter Toevoegen</h3>
          <div className="admin-form-group">
            <label className="admin-form-label">Anime:</label>
            <select
              value={selectedAnimeId}
              onChange={(e) => setSelectedAnimeId(e.target.value)}
              className="admin-form-select"
            >
              <option value="">-- Selecteer een anime --</option>
              {animes.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Karakternaam:</label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Voer karakternaam in"
              className="admin-form-input"
            />
          </div>
          <button onClick={addCharacter} className="admin-add-btn">
            ➕ Karakter Toevoegen
          </button>
        </div>

        <div className="admin-search-container">
          <select
            value={selectedAnimeId}
            onChange={(e) => setSelectedAnimeId(e.target.value)}
            className="admin-form-select"
          >
            <option value="">Alle animes</option>
            {animes.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Zoek karakters..."
            value={characterSearch}
            onChange={(e) => setCharacterSearch(e.target.value)}
            className="admin-search-input"
          />
          <span className="admin-result-count">
            {filteredCharacters.length} karakters
          </span>
        </div>

        {filteredCharacters.length === 0 ? (
          <p>Geen karakters gevonden.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr className="admin-table-header">
                  <th className="admin-table-th">Anime</th>
                  <th className="admin-table-th">Karakter</th>
                  <th className="admin-table-th">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredCharacters.map(c => (
                  <tr key={c.id} className="admin-table-row">
                    <td className="admin-table-td">{c.anime_name}</td>
                    <td className="admin-table-td">
                      {editingCharacterId === c.id ? (
                        <input
                          type="text"
                          value={editingCharacterName}
                          onChange={(e) => setEditingCharacterName(e.target.value)}
                          className="admin-edit-input"
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="admin-table-td">
                      {editingCharacterId === c.id ? (
                        <>
                          <button
                            onClick={() => updateCharacter(c.id, c.anime_id)}
                            className="admin-save-btn"
                          >
                            ✓ Opslaan
                          </button>
                          <button
                            onClick={() => setEditingCharacterId(null)}
                            className="admin-cancel-btn"
                          >
                            ✕ Annuleren
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingCharacterId(c.id);
                              setEditingCharacterName(c.name);
                            }}
                            className="admin-edit-btn"
                          >
                            ✏️ Bewerken
                          </button>
                          <button
                            onClick={() => deleteCharacter(c.id, c.anime_id, c.name)}
                            className="admin-delete-btn"
                          >
                            🗑️ Verwijderen
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">🎬 Anime Beheren</h2>
        <p className="admin-section-text">
          Je kunt animes direct toevoegen, bewerken en verwijderen op de startpagina.
        </p>
        <button
          onClick={() => navigate('/')}
          className="admin-go-home-btn"
        >
          Naar Anime Overzicht
        </button>
      </div>
    </div>
  );
}
