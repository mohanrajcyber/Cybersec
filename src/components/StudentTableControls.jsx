const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'score-desc', label: 'Score high → low' },
  { value: 'score-asc', label: 'Score low → high' },
  { value: 'login-desc', label: 'Last login recent' },
  { value: 'login-asc', label: 'Last login oldest' },
]

const STRENGTH_OPTIONS = [
  { value: 'all', label: 'All strength' },
  { value: 'weak', label: 'Weak' },
  { value: 'fair', label: 'Fair' },
  { value: 'strong', label: 'Strong' },
  { value: 'very-strong', label: 'Very strong' },
  { value: 'none', label: 'No password' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All students' },
  { value: 'logged-in', label: 'Logged in' },
  { value: 'not-yet', label: 'Not yet logged in' },
]

export default function StudentTableControls({
  total,
  filtered,
  search,
  onSearch,
  sortBy,
  onSortChange,
  strengthFilter,
  onStrengthFilterChange,
  statusFilter,
  onStatusFilterChange,
}) {
  return (
    <div className="student-table-controls">
      <div className="student-table-controls-left">
        <input
          className="field-input student-search-input"
          type="search"
          placeholder="Search username or name…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search students"
        />
        <span className="student-table-count">
          {filtered === total
            ? `${total} student${total === 1 ? '' : 's'}`
            : `${filtered} of ${total} students`}
        </span>
      </div>
      <div className="student-table-filters">
        <label className="student-filter-item">
          <span className="student-filter-label">Sort</span>
          <select
            className="field-input student-filter-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort students"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label className="student-filter-item">
          <span className="student-filter-label">Strength</span>
          <select
            className="field-input student-filter-select"
            value={strengthFilter}
            onChange={(e) => onStrengthFilterChange(e.target.value)}
            aria-label="Filter by password strength"
          >
            {STRENGTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label className="student-filter-item">
          <span className="student-filter-label">Status</span>
          <select
            className="field-input student-filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            aria-label="Filter by login status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

export function applyStudentFilters(rows, { search, sortBy, strengthFilter, statusFilter }) {
  const q = search.trim().toLowerCase()

  let result = rows.filter((s) => {
    if (q) {
      const name = (s.displayName || s.name || '').toLowerCase()
      if (!s.username.includes(q) && !name.includes(q)) return false
    }

    if (strengthFilter !== 'all') {
      const cls = s.strength?.cls || 'none'
      if (strengthFilter === 'none') {
        if (s.password && s.password !== '—') return false
      } else if (cls !== strengthFilter) {
        return false
      }
    }

    if (statusFilter === 'logged-in' && !s.lastLogin) return false
    if (statusFilter === 'not-yet' && s.lastLogin) return false

    return true
  })

  result = [...result].sort((a, b) => {
    const nameA = (a.displayName || a.name || a.username).toLowerCase()
    const nameB = (b.displayName || b.name || b.username).toLowerCase()
    const scoreA = a.score ?? 0
    const scoreB = b.score ?? 0
    const loginA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0
    const loginB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0

    switch (sortBy) {
      case 'name-desc':
        return nameB.localeCompare(nameA)
      case 'score-desc':
        return scoreB - scoreA || nameA.localeCompare(nameB)
      case 'score-asc':
        return scoreA - scoreB || nameA.localeCompare(nameB)
      case 'login-desc':
        return loginB - loginA || nameA.localeCompare(nameB)
      case 'login-asc':
        return loginA - loginB || nameA.localeCompare(nameB)
      case 'name-asc':
      default:
        return nameA.localeCompare(nameB)
    }
  })

  return result
}
