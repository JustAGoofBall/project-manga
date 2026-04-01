import PropTypes from 'prop-types';

export default function AdminAnimesSection({
  filteredAnimes,
  animes,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  formName,
  setFormName,
  editingAnimeId,
  setEditingAnimeId,
  editingAnimeName,
  setEditingAnimeName,
  onAddAnime,
  onUpdateAnime,
  onDeleteAnime
}) {
  return (
    <div className="admin-section">
      <h2 className="admin-section-title">🎬 Anime Beheren</h2>

      <div className="admin-add-form">
        <h3 className="admin-form-title">Nieuwe Anime Toevoegen</h3>
        <div className="admin-form-group">
          <label className="admin-form-label">Anime Naam:</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Voer anime naam in"
            className="admin-form-input"
          />
        </div>
        <button onClick={onAddAnime} className="admin-add-btn">
          ➕ Anime Toevoegen
        </button>
      </div>

      {animes.length === 0 ? (
        <p>Geen animes gevonden.</p>
      ) : (
        <>
          <div className="admin-search-container">
            <input
              type="text"
              placeholder="Zoek animes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="admin-form-select"
            >
              <option value="name">Sorteren: Naam ↑</option>
              <option value="characters">Sorteren: Karakters ↓</option>
            </select>
            <span className="admin-result-count">
              {filteredAnimes.length} van {animes.length} animes
            </span>
          </div>

          <div className="admin-pagination-info">
            Pagina {currentPage + 1} van {Math.ceil(filteredAnimes.length / itemsPerPage)} ({filteredAnimes.length} animes gevonden)
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr className="admin-table-header">
                  <th className="admin-table-th">Anime Naam</th>
                  <th className="admin-table-th">Karakters</th>
                  <th className="admin-table-th">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimes
                  .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                  .map(a => (
                    <tr key={a.id} className="admin-table-row">
                      <td className="admin-table-td">
                        {editingAnimeId === a.id ? (
                          <input
                            type="text"
                            value={editingAnimeName}
                            onChange={(e) => setEditingAnimeName(e.target.value)}
                            className="admin-edit-input"
                          />
                        ) : (
                          a.name
                        )}
                      </td>
                      <td className="admin-table-td">
                        {a.characters?.length ?? 0}
                      </td>
                      <td className="admin-table-td">
                        {editingAnimeId === a.id ? (
                          <>
                            <button
                              onClick={() => onUpdateAnime(a.id)}
                              className="admin-save-btn"
                            >
                              ✓ Opslaan
                            </button>
                            <button
                              onClick={() => setEditingAnimeId(null)}
                              className="admin-cancel-btn"
                            >
                              ✕ Annuleren
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingAnimeId(a.id);
                                setEditingAnimeName(a.name);
                              }}
                              className="admin-edit-btn"
                            >
                              ✏️ Bewerken
                            </button>
                            <button
                              onClick={() => onDeleteAnime(a.id, a.name)}
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
              disabled={(currentPage + 1) * itemsPerPage >= filteredAnimes.length}
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

AdminAnimesSection.propTypes = {
  filteredAnimes: PropTypes.array.isRequired,
  animes: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  setFormName: PropTypes.func.isRequired,
  editingAnimeId: PropTypes.oneOfType([PropTypes.number, null]),
  setEditingAnimeId: PropTypes.func.isRequired,
  editingAnimeName: PropTypes.string.isRequired,
  setEditingAnimeName: PropTypes.func.isRequired,
  onAddAnime: PropTypes.func.isRequired,
  onUpdateAnime: PropTypes.func.isRequired,
  onDeleteAnime: PropTypes.func.isRequired,
};
