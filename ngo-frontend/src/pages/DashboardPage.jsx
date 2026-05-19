import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDashboard } from '../hooks'
import MainLayout from '../layouts/MainLayout'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { PageLoader } from '../components/Loader'

// --- Icons (same as before) ---
const GridIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm6.5-9A2.25 2.25 0 0013.25 4.25v2.5A2.25 2.25 0 0015.75 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zM11 13.25A2.25 2.25 0 0113.25 11h2.5A2.25 2.25 0 0118 13.25v2.5A2.25 2.25 0 0115.75 18h-2.5A2.25 2.25 0 0111 15.75v-2.5z" clipRule="evenodd" />
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
)

// --- MAIN COMPONENT ---
export default function DashboardPage() {
  const { user, isNGO } = useAuth()
  const navigate = useNavigate()

  // ✅ FIX 1: Wait until user is loaded
  if (!user) return <PageLoader />

  // ✅ FIX 2: Safe role usage
  const role = user.role

  const { data, loading, error } = useDashboard(role)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const displayName = isNGO
    ? (user.organization_name || user.full_name)
    : user.first_name || user.full_name

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-400">{greeting()},</p>
          <h1 className="text-3xl font-semibold">{displayName} 👋</h1>
          <p className="text-gray-500 text-sm">
            {isNGO
              ? "Here's an overview of your programs."
              : "Here's your volunteer activity."}
          </p>
        </div>

        {/* Loading */}
        {loading && <PageLoader />}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Data */}
        {!loading && !error && data && (
          <>
            {isNGO ? (
              <div className="grid grid-cols-2 gap-4">
                <StatsCard label="Programs" value={data?.summary?.total_programs} icon={<GridIcon />} />
                <StatsCard label="Participants" value={data?.summary?.total_participants_across_programs} icon={<UsersIcon />} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <StatsCard label="Joined" value={data?.summary?.total_programs_joined} icon={<GridIcon />} />
                <StatsCard label="Completed" value={data?.summary?.completed_programs_count} icon={<CheckIcon />} />
              </div>
            )}
          </>
        )}

      </div>
    </MainLayout>
  )
}