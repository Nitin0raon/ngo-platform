import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { programService } from '../services/programService'
import MainLayout from '../layouts/MainLayout'
import ProgramCard from '../components/ProgramCard'
import EmptyState from '../components/EmptyState'
import { PageLoader } from '../components/Loader'
import Button from '../components/Button'

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
)

const FilterIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
  </svg>
)

const ChevronLeft = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
)

const ChevronRight = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
)

const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

export default function ProgramsPage() {
  const { isNGO, isVolunteer } = useAuth()
  const navigate = useNavigate()

  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [joinedIds, setJoinedIds] = useState(new Set())
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null })
  const PAGE_SIZE = 9

  // Fetch joined programs for volunteer
  useEffect(() => {
    if (!isVolunteer) return
    programService.getMyParticipations({ status: 'active' })
      .then(data => {
        const ids = new Set((data.results || []).map(p => p.program.id))
        setJoinedIds(ids)
      })
      .catch(() => {})
  }, [isVolunteer])

  const fetchPrograms = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page,
        page_size: PAGE_SIZE,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      }
      const data = await programService.getPrograms(params)
      setPrograms(data.results || [])
      setPagination({ count: data.count, next: data.next, previous: data.previous })
    } catch {
      setError('Failed to load programs. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, search])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrograms()
    }, search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [fetchPrograms])

  const handleFilterChange = (val) => {
    setStatusFilter(val)
    setPage(1)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleJoined = (programId) => {
    setJoinedIds(prev => new Set([...prev, programId]))
  }

  const handleLeft = (programId) => {
    setJoinedIds(prev => {
      const next = new Set(prev)
      next.delete(programId)
      return next
    })
  }

  const totalPages = Math.ceil(pagination.count / PAGE_SIZE)

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="font-display text-3xl font-semibold text-gray-900">
              {isNGO ? 'Programs' : 'Discover Programs'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {pagination.count > 0 ? `${pagination.count} program${pagination.count !== 1 ? 's' : ''} found` : 'Browse available programs'}
            </p>
          </div>
          {isNGO && (
            <Button variant="primary" onClick={() => navigate('/create-program')}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Create program
            </Button>
          )}
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-slide-up">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search programs…"
              className="input-field pl-10"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {statusFilters.map(f => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  statusFilter === f.value
                    ? 'bg-forest-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Capacity filter */}
          <button
            onClick={() => {
              // Toggle has_capacity filter via URL params
              fetchPrograms()
            }}
            className="btn-secondary flex-shrink-0 gap-2"
          >
            <FilterIcon />
            Filters
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <PageLoader />
        ) : error ? (
          <div className="card p-8 text-center">
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button variant="secondary" onClick={fetchPrograms}>Retry</Button>
          </div>
        ) : programs.length === 0 ? (
          <div className="card">
            <EmptyState
              type={search || statusFilter ? 'search' : 'programs'}
              title={search || statusFilter ? 'No results found' : 'No programs yet'}
              description={
                search || statusFilter
                  ? 'Try adjusting your search or filters.'
                  : isNGO
                  ? 'Create your first program to get started.'
                  : 'Check back soon for new volunteer opportunities.'
              }
              action={isNGO ? () => navigate('/create-program') : undefined}
              actionLabel={isNGO ? 'Create program' : undefined}
            />
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {programs.map((program, i) => (
                <div
                  key={program.id}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ProgramCard
                    program={program}
                    isJoined={joinedIds.has(program.id)}
                    showActions={isVolunteer && program.status === 'active'}
                    onJoin={handleJoined}
                    onLeave={handleLeft}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-10 animate-fade-in">
                <p className="text-sm text-gray-400">
                  Page {page} of {totalPages} · {pagination.count} total
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                            page === pageNum
                              ? 'bg-forest-600 text-white shadow-sm'
                              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}
