import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useUIStore } from '@/store/useUIStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/useAuthStore'
import { useDispatch } from 'react-redux'
import { updateUser as updateUserAction } from '@/store/slices/authSlice'



export const DashboardLayout = ({ children }) => {
    const { isSidebarOpen, closeSidebar } = useUIStore()
    const { user, token } = useAuthStore()
    const dispatch = useDispatch()
    const [hasSynced, setHasSynced] = useState(false)

    useEffect(() => {
        const syncProfile = async () => {
            // If we have a token but haven't synced in this session yet
            if (!token || hasSynced) return



            try {
                const profileData = await authService.getProfile()
                const userData = profileData.data || profileData
                // console.log('Extracted User Data for Store:', userData)
                dispatch(updateUserAction(userData))
                setHasSynced(true)
            } catch (error) {
                console.error('Background profile sync failed:', error)
                // If we already have user data from persistence, we don't need to treat this as a fatal error
                if (user?.id) {
                    setHasSynced(true) // Don't keep retrying if it fails but we have cached data
                }
            } finally {
                // Background sync finished
            }
        }

        syncProfile()
    }, [dispatch, token, hasSynced, user?.id])



    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-cairo transition-colors duration-300" dir="rtl">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSidebar}
                        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-brand-background dark:bg-slate-950/50">
                    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

