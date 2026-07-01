import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useKickListener } from '../../../shared/hooks/useKickListener'
import { useAlertNotifications } from '../../../shared/hooks/useAlertNotifications'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  useKickListener()
  useAlertNotifications()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}
