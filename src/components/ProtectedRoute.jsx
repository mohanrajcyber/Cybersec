import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, trainerOnly = false }) {
  const { session } = useAuth()

  if (!session) return <Navigate to="/login" replace />
  if (trainerOnly && session.type !== 'trainer') return <Navigate to="/" replace />
  if (!trainerOnly && session.type === 'trainer') return <Navigate to="/admin" replace />

  return children
}
