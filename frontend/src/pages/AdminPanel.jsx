import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setSelectedAnimeId('');
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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👑 Admin Panel</h1>
        <p style={styles.subtitle}>Beheer users en content</p>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}
      {success && <div style={styles.successBox}>{success}</div>}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>👥 Users Beheren</h2>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Zoek users op naam of email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.resultCount}>
            {filteredUsers.length} van {users.length} users
          </span>
        </div>

        {loading ? (
          <p>Laden...</p>
        ) : users.length === 0 ? (
          <p>Geen users gevonden.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Gebruiker</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <strong>{u.username}</strong>
                      {u.id === user.id && <span style={styles.badge}> (Jij)</span>}
                    </td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      {u.is_admin ? (
                        <span style={styles.adminBadge}>👑 Admin</span>
                      ) : (
                        <span style={styles.userBadge}>👤 User</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {u.id !== user.id && (
                        <div style={styles.buttonGroup}>
                          <button
                            onClick={() => toggleAdmin(u.id, u.is_admin)}
                            style={u.is_admin ? styles.removeAdminBtn : styles.makeAdminBtn}
                          >
                            {u.is_admin ? 'Admin verwijderen' : 'Admin maken'}
                          </button>
                          <button
                            onClick={() => deleteUser(u.id, u.username)}
                            style={styles.deleteBtn}
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

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎭 Karakters Beheren</h2>

        <div style={styles.addForm}>
          <h3 style={styles.formTitle}>Nieuw Karakter Toevoegen</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Anime:</label>
            <select
              value={selectedAnimeId}
              onChange={(e) => setSelectedAnimeId(e.target.value)}
              style={styles.select}
            >
              <option value="">-- Selecteer een anime --</option>
              {animes.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Karakternaam:</label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Voer karakternaam in"
              style={styles.input}
            />
          </div>
          <button onClick={addCharacter} style={styles.addBtn}>
            ➕ Karakter Toevoegen
          </button>
        </div>

        <div style={styles.searchContainer}>
          <select
            value={selectedAnimeId}
            onChange={(e) => setSelectedAnimeId(e.target.value)}
            style={styles.select}
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
            style={styles.searchInput}
          />
          <span style={styles.resultCount}>
            {filteredCharacters.length} karakters
          </span>
        </div>

        {filteredCharacters.length === 0 ? (
          <p>Geen karakters gevonden.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Anime</th>
                  <th style={styles.th}>Karakter</th>
                  <th style={styles.th}>Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredCharacters.map(c => (
                  <tr key={c.id} style={styles.tableRow}>
                    <td style={styles.td}>{c.anime_name}</td>
                    <td style={styles.td}>
                      {editingCharacterId === c.id ? (
                        <input
                          type="text"
                          value={editingCharacterName}
                          onChange={(e) => setEditingCharacterName(e.target.value)}
                          style={styles.editInput}
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td style={styles.td}>
                      {editingCharacterId === c.id ? (
                        <>
                          <button
                            onClick={() => updateCharacter(c.id, c.anime_id)}
                            style={styles.saveBtn}
                          >
                            ✓ Opslaan
                          </button>
                          <button
                            onClick={() => setEditingCharacterId(null)}
                            style={styles.cancelBtn}
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
                            style={styles.editBtn}
                          >
                            ✏️ Bewerken
                          </button>
                          <button
                            onClick={() => deleteCharacter(c.id, c.anime_id, c.name)}
                            style={styles.deleteBtn}
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

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎬 Anime Beheren</h2>
        <p style={styles.sectionText}>
          Je kunt animes direct toevoegen, bewerken en verwijderen op de startpagina.
        </p>
        <button
          onClick={() => navigate('/')}
          style={styles.goToHomeBtn}
        >
          Naar Anime Overzicht
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' },
  header: { marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' },
  title: { margin: 0, fontSize: '2rem', color: '#1a202c' },
  subtitle: { margin: '0.5rem 0 0', color: '#718096', fontSize: '1rem' },

  errorBox: { background: '#fed7d7', color: '#c53030', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' },
  successBox: { background: '#c6f6d5', color: '#22543d', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' },

  section: { marginBottom: '3rem', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  sectionTitle: { margin: '0 0 1.5rem', fontSize: '1.3rem', color: '#2d3748' },
  sectionText: { color: '#718096', marginBottom: '1rem' },

  addForm: { background: '#f7fafc', padding: '1.5rem', borderRadius: '6px', marginBottom: '2rem', border: '1px solid #e2e8f0' },
  formTitle: { margin: '0 0 1rem', fontSize: '1rem', color: '#2d3748' },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.6rem', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' },
  select: { width: '100%', padding: '0.6rem', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box', background: 'white' },
  addBtn: { padding: '0.6rem 1.2rem', background: '#38a169', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' },

  searchContainer: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' },
  searchInput: { flex: 1, padding: '0.6rem', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '0.95rem' },
  resultCount: { color: '#718096', fontSize: '0.9rem', whiteSpace: 'nowrap' },

  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#edf2f7' },
  th: { padding: '0.75rem', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #cbd5e0' },
  tableRow: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '0.75rem', verticalAlign: 'middle' },

  editInput: { width: '100%', padding: '0.4rem', border: '1px solid #3182ce', borderRadius: '4px', fontSize: '0.9rem', boxSizing: 'border-box' },
  editBtn: { padding: '0.3rem 0.6rem', background: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.3rem' },
  saveBtn: { padding: '0.3rem 0.6rem', background: '#38a169', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.3rem' },
  cancelBtn: { padding: '0.3rem 0.6rem', background: '#a0aec0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  deleteBtn: { padding: '0.3rem 0.6rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },

  badge: { background: '#edf2f7', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' },
  adminBadge: { background: '#d4a574', color: '#1a1a2e', padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' },
  userBadge: { background: '#bee3f8', color: '#2c5282', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' },

  buttonGroup: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  makeAdminBtn: { padding: '0.4rem 0.8rem', background: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  removeAdminBtn: { padding: '0.4rem 0.8rem', background: '#ed8936', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },

  goToHomeBtn: { padding: '0.6rem 1.2rem', background: '#38a169', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }
};
