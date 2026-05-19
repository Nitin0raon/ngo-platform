import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  const content = (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-slide-up">
        <div className="text-8xl font-display font-semibold text-gray-100 mb-4 select-none">
          404
        </div>
        <h1 className="font-display text-2xl font-semibold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="btn-primary"
          >
            {isAuthenticated ? 'Back to dashboard' : 'Go home'}
          </Link>
        </div>
      </div>
    </div>
  )

  if (isAuthenticated) {
    return <MainLayout>{content}</MainLayout>
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {content}
    </div>
  )
}
