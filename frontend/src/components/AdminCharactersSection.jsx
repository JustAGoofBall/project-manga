import PropTypes from 'prop-types';

export default function AdminCharactersSection({
  filteredCharacters,
  characters,
  animes,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  search,
  setSearch,
  selectedAnimeId,
  setSelectedAnimeId,
  characterName,
  setCharacterName,
  editingCharacterId,
  setEditingCharacterId,
  editingCharacterName,
  setEditingCharacterName,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter
}) {
  return (
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
        <button onClick={onAddCharacter} className="admin-add-btn">
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
        <span className="admin-result-count">
          {filteredCharacters.length} karakters
        </span>
      </div>

      {filteredCharacters.length === 0 ? (
        <p>Geen karakters gevonden.</p>
      ) : (
        <>
          <div className="admin-pagination-info">
            Pagina {currentPage + 1} van {Math.ceil(filteredCharacters.length / itemsPerPage)} ({filteredCharacters.length} karakters totaal)
          </div>
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
                {filteredCharacters
                  .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                  .map(c => (
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
                              onClick={() => onUpdateCharacter(c.id, c.anime_id)}
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
                              onClick={() => onDeleteCharacter(c.id, c.anime_id, c.name)}
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
          <div className="admin-pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="admin-pagination-btn"
            >
              ← Vorige
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={(currentPage + 1) * itemsPerPage >= filteredCharacters.length}
              className="admin-pagination-btn"
            >
              Volgende →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

AdminCharactersSection.propTypes = {
  filteredCharacters: PropTypes.array.isRequired,
  characters: PropTypes.array.isRequired,
  animes: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  selectedAnimeId: PropTypes.string.isRequired,
  setSelectedAnimeId: PropTypes.func.isRequired,
  characterName: PropTypes.string.isRequired,
  setCharacterName: PropTypes.func.isRequired,
  editingCharacterId: PropTypes.oneOfType([PropTypes.number, null]),
  setEditingCharacterId: PropTypes.func.isRequired,
  editingCharacterName: PropTypes.string.isRequired,
  setEditingCharacterName: PropTypes.func.isRequired,
  onAddCharacter: PropTypes.func.isRequired,
  onUpdateCharacter: PropTypes.func.isRequired,
  onDeleteCharacter: PropTypes.func.isRequired,
};
