import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminUsersSection from '../components/AdminUsersSection';
import AdminCharactersSection from '../components/AdminCharactersSection';
import AdminAnimesSection from '../components/AdminAnimesSection';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  // Users state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userSortBy, setUserSortBy] = useState('username');
  const [userCurrentPage, setUserCurrentPage] = useState(0);

  // Anime state
  const [animes, setAnimes] = useState([]);
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [animeSearch, setAnimeSearch] = useState('');
  const [animeSortBy, setAnimeSortBy] = useState('name'); // 'name' or 'characters'
  const [animeFormName, setAnimeFormName] = useState('');
  const [editingAnimeId, setEditingAnimeId] = useState(null);
  const [editingAnimeName, setEditingAnimeName] = useState('');
  const [animeCurrentPage, setAnimeCurrentPage] = useState(0);

  // Characters state
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [characterSearch, setCharacterSearch] = useState('');
  const [selectedAnimeId, setSelectedAnimeId] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [editingCharacterId, setEditingCharacterId] = useState(null);
  const [editingCharacterName, setEditingCharacterName] = useState('');
  const [characterCurrentPage, setCharacterCurrentPage] = useState(0);

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
    // Filter and sort users
    let filtered = [...users]; // Make a copy to avoid mutation
    
    // Filter by search
    if (userSearch.trim()) {
      const lowerSearch = userSearch.toLowerCase();
      filtered = filtered.filter(u =>
        u.username.toLowerCase().includes(lowerSearch) ||
        u.email.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Sort based on selection
    if (userSortBy === 'email') {
      filtered.sort((a, b) => a.email.localeCompare(b.email, 'nl', { sensitivity: 'base' }));
    } else if (userSortBy === 'admin') {
      // Sort admins first, then regular users
      filtered.sort((a, b) => {
        if (a.is_admin === b.is_admin) {
          return a.username.localeCompare(b.username, 'nl', { sensitivity: 'base' });
        }
        return b.is_admin - a.is_admin; // Admins first
      });
    } else {
      // Sort alphabetically by username
      filtered.sort((a, b) => a.username.localeCompare(b.username, 'nl', { sensitivity: 'base' }));
    }
    
    setFilteredUsers(filtered);
    setUserCurrentPage(0); // Reset to first page when filter/sort changes
  }, [userSearch, users, userSortBy]);

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
    setCharacterCurrentPage(0); // Reset to first page when filter changes
  }, [characterSearch, characters, selectedAnimeId]);

  useEffect(() => {
    // Filter and sort animes
    let filtered = [...animes]; // Make a copy to avoid mutation
    
    // Filter by search
    if (animeSearch.trim()) {
      const lowerSearch = animeSearch.toLowerCase();
      filtered = filtered.filter(a => a.name.toLowerCase().includes(lowerSearch));
    }
    
    // Sort based on selection
    if (animeSortBy === 'characters') {
      // Sort by character count descending (most characters first)
      filtered.sort((a, b) => {
        const aCount = a.characters?.length ?? 0;
        const bCount = b.characters?.length ?? 0;
        return bCount - aCount; // Descending
      });
    } else {
      // Sort alphabetically by name
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }));
    }
    
    setFilteredAnimes(filtered);
    setAnimeCurrentPage(0); // Reset to first page when filter changes
  }, [animeSearch, animes, animeSortBy]);

  async function loadUsers() {
    try {
      const res = await authFetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data.data || []);
      setError('');
    } catch (e) {
      handleError('Kon users niet laden: ' + e.message);
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

  // ===== COMMON HANDLER FUNCTIONS =====
  const handleError = (message) => {
    setError(message);
    setSuccess('');
  };

  const handleSuccess = (message) => {
    setSuccess(message);
    setError('');
  };

  const resetFormState = () => {
    setError('');
    setSuccess('');
  };

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
      handleError('Selecteer een anime en voer een karakternaam in');
      return;
    }

    resetFormState();
    try {
      const res = await authFetch(`/api/anime/${selectedAnimeId}/characters`, {
        method: 'POST',
        body: JSON.stringify({ name: characterName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess('Karakter toegevoegd');
      setCharacterName('');
      setCharacterCurrentPage(0);
      loadCharacters();
    } catch (e) {
      handleError(e.message);
    }
  }

  async function updateCharacter(characterId, animeId) {
    if (!editingCharacterName.trim()) {
      handleError('Voer een karakternaam in');
      return;
    }

    resetFormState();
    try {
      const res = await authFetch(`/api/anime/${animeId}/characters/${characterId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editingCharacterName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess('Karakter bijgewerkt');
      setEditingCharacterId(null);
      setEditingCharacterName('');
      loadCharacters();
    } catch (e) {
      handleError(e.message);
    }
  }

  async function deleteCharacter(characterId, animeId, characterName) {
    if (!window.confirm(`Weet je zeker dat je ${characterName} wilt verwijderen?`)) {
      return;
    }

    resetFormState();
    try {
      const res = await authFetch(`/api/anime/${animeId}/characters/${characterId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess(`${characterName} is verwijderd`);
      loadCharacters();
    } catch (e) {
      handleError(e.message);
    }
  }

  async function toggleAdmin(userId, currentStatus) {
    resetFormState();
    try {
      const res = await authFetch(`/api/admin/users/${userId}/admin`, {
        method: 'PUT',
        body: JSON.stringify({ is_admin: !currentStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess(currentStatus ? 'Admin status verwijderd' : 'Admin status gegeven');
      setUserCurrentPage(0);
      loadUsers();
    } catch (e) {
      handleError(e.message);
    }
  }

  async function deleteUser(userId, username) {
    if (!window.confirm(`Weet je zeker dat je ${username} wilt verwijderen? Dit kan niet ongedaan gemaakt worden.`)) {
      return;
    }

    resetFormState();
    try {
      const res = await authFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess(`${username} is verwijderd`);
      setUserCurrentPage(0);
      loadUsers();
    } catch (e) {
      handleError(e.message);
    }
  }

  // ===== ANIME MANAGEMENT FUNCTIONS =====
  async function addAnime() {
    if (!animeFormName.trim()) {
      handleError('Voer een anime naam in');
      return;
    }

    resetFormState();
    try {
      const res = await authFetch('/api/anime', {
        method: 'POST',
        body: JSON.stringify({ name: animeFormName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess('Anime toegevoegd');
      setAnimeFormName('');
      setAnimeCurrentPage(0);
      loadAnimes();
    } catch (e) {
      handleError(e.message);
    }
  }

  async function updateAnime(animeId) {
    if (!editingAnimeName.trim()) {
      handleError('Voer een anime naam in');
      return;
    }

    resetFormState();
    try {
      const res = await authFetch(`/api/anime/${animeId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editingAnimeName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess('Anime bijgewerkt');
      setEditingAnimeId(null);
      setEditingAnimeName('');
      setAnimeCurrentPage(0);
      loadAnimes();
    } catch (e) {
      handleError(e.message);
    }
  }

  async function deleteAnime(animeId, animeName) {
    if (!window.confirm(`Weet je zeker dat je "${animeName}" en alle bijbehorende karakters wilt verwijderen?`)) {
      return;
    }

    resetFormState();
    try {
      const res = await authFetch(`/api/anime/${animeId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleSuccess(`${animeName} is verwijderd`);
      setAnimeCurrentPage(0);
      loadAnimes();
      loadCharacters();
    } catch (e) {
      handleError(e.message);
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

      <AdminUsersSection
        filteredUsers={filteredUsers}
        users={users}
        user={user}
        currentPage={userCurrentPage}
        setCurrentPage={setUserCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        search={userSearch}
        setSearch={setUserSearch}
        sortBy={userSortBy}
        setSortBy={setUserSortBy}
        loading={loading}
        onToggleAdmin={toggleAdmin}
        onDeleteUser={deleteUser}
      />

      <AdminCharactersSection
        filteredCharacters={filteredCharacters}
        characters={characters}
        animes={animes}
        currentPage={characterCurrentPage}
        setCurrentPage={setCharacterCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        search={characterSearch}
        setSearch={setCharacterSearch}
        selectedAnimeId={selectedAnimeId}
        setSelectedAnimeId={setSelectedAnimeId}
        characterName={characterName}
        setCharacterName={setCharacterName}
        editingCharacterId={editingCharacterId}
        setEditingCharacterId={setEditingCharacterId}
        editingCharacterName={editingCharacterName}
        setEditingCharacterName={setEditingCharacterName}
        onAddCharacter={addCharacter}
        onUpdateCharacter={updateCharacter}
        onDeleteCharacter={deleteCharacter}
      />

      <AdminAnimesSection
        filteredAnimes={filteredAnimes}
        animes={animes}
        currentPage={animeCurrentPage}
        setCurrentPage={setAnimeCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        search={animeSearch}
        setSearch={setAnimeSearch}
        sortBy={animeSortBy}
        setSortBy={setAnimeSortBy}
        formName={animeFormName}
        setFormName={setAnimeFormName}
        editingAnimeId={editingAnimeId}
        setEditingAnimeId={setEditingAnimeId}
        editingAnimeName={editingAnimeName}
        setEditingAnimeName={setEditingAnimeName}
        onAddAnime={addAnime}
        onUpdateAnime={updateAnime}
        onDeleteAnime={deleteAnime}
      />
    </div>
  );
}
