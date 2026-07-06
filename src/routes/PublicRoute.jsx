import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

/**
 * PublicRoute prevents authenticated users from accessing 
 * public pages like Landing, Login, and Register.
 * Redirects them back to their respective dashboard.
 */
export const PublicRoute = ({ children }) => {
    const { isAuthenticated, role, user } = useAuthStore()

    if (isAuthenticated && role) {
        // If user is not verified, they should stay on public pages (like verify-email)
        const isVerified = user?.is_verified ?? user?.isVerified;
        if (isVerified === false) {
            return children
        }

        // Redirect to their dashboard home based on role
        const validRoles = ['customer', 'driver', 'company', 'governorate', 'admin'];
        if (validRoles.includes(role)) {
            const targetPath = role === 'governorate' ? '/gov' : (role === 'admin' ? '/admin' : `/${role}`)
            return <Navigate to={targetPath} replace />
        }
    }

    return children
}
