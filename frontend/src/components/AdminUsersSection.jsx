import PropTypes from 'prop-types';

export default function AdminUsersSection({
  filteredUsers,
  users,
  user,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  search,
  setSearch,
  sortBy,
  setSortBy,
  loading,
  onToggleAdmin,
  onDeleteUser
}) {
  return (
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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="admin-form-select"
        >
          <option value="username">Sorteren: Naam ↑</option>
          <option value="email">Sorteren: Email ↑</option>
          <option value="admin">Sorteren: Admin First</option>
        </select>
        <span className="admin-result-count">
          {filteredUsers.length} van {users.length} users
        </span>
      </div>

      {loading ? (
        <p>Laden...</p>
      ) : users.length === 0 ? (
        <p>Geen users gevonden.</p>
      ) : (
        <>
          <div className="admin-pagination-info">
            Pagina {currentPage + 1} van {Math.ceil(filteredUsers.length / itemsPerPage)} ({filteredUsers.length} users gevonden)
          </div>
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
                {filteredUsers
                  .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                  .map(u => (
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
                              onClick={() => onToggleAdmin(u.id, u.is_admin)}
                              className={u.is_admin ? 'admin-remove-admin-btn' : 'admin-make-admin-btn'}
                            >
                              {u.is_admin ? 'Admin verwijderen' : 'Admin maken'}
                            </button>
                            <button
                              onClick={() => onDeleteUser(u.id, u.username)}
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
              disabled={(currentPage + 1) * itemsPerPage >= filteredUsers.length}
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

AdminUsersSection.propTypes = {
  filteredUsers: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onToggleAdmin: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
};
