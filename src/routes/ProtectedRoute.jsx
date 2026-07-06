import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role, user } = useAuthStore()
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Redirect to verification if not verified
    const isVerified = user?.is_verified ?? user?.isVerified;
    if (isVerified === false) {
        return <Navigate to="/verify-email" state={{ email: user?.email, role: role }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

