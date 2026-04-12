import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { useThemeStore } from './store/useThemeStore'
import { Toaster } from 'react-hot-toast'

// Pages
import { LandingPage } from './features/landing/LandingPage'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage'
import { VerifyEmailPage } from './features/auth/VerifyEmailPage'
import { CustomerDashboard } from './features/customer/CustomerDashboard'
import { ShipmentsPage } from './features/customer/ShipmentsPage'
import { ShipmentDetailsPage } from './features/customer/ShipmentDetailsPage'
import { IncomingOffersPage } from './features/customer/IncomingOffersPage'
import { CreateShipmentPage } from './features/shipments/CreateShipmentPage'
import { BiddingInterface } from './features/bidding/BiddingInterface'
import { DriverDashboard } from './features/driver/DriverDashboard'
import { AvailableShipments } from './features/driver/AvailableShipments'
import { DriverShipmentDetails } from './features/driver/DriverShipmentDetails'
import { ActiveShipments } from './features/driver/ActiveShipments'
import { DriverReports } from './features/driver/DriverReports'
import { FleetManagement } from './features/fleet/FleetManagement'
import { GovDashboard } from './features/governorate/GovDashboard'
import { AdminDashboard } from './features/admin/AdminDashboard'
import { DriverVerification } from './features/admin/DriverVerification'
import { AdminReports } from './features/admin/AdminReports'
import { PlatformManagement } from './features/admin/PlatformManagement'
import { SystemSettings } from './features/admin/SystemSettings'
import { ShipmentTracking } from './features/tracking/ShipmentTracking'
import { RoadAlerts } from './features/alerts/RoadAlerts'
import { DriverManagement } from './features/company/DriverManagement'
import { DisputeResolution } from './features/admin/DisputeResolution'
import { DigitalContracts } from './features/admin/DigitalContracts'
import { ProfilePage } from './features/profile/ProfilePage'
import { TermsPage } from './features/legal/TermsPage'
import { ContactPage } from './features/support/ContactPage'
import { FaqPage } from './features/support/FaqPage'
import { ReportIssuePage } from './features/support/ReportIssuePage'
import { AllReportsPage } from './features/support/AllReportsPage'
import { SocketSync } from './components/SocketSync'
import ScrollToTop from './components/ScrollToTop'

// Placeholders for features
const Placeholder = ({ title }) => (
    <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-100/50 shadow-sm text-center font-cairo">
        <div className="h-24 w-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
            <span className="text-5xl drop-shadow-sm">🏗️</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{title}</h2>
        <p className="text-slate-500 font-bold max-w-xs leading-relaxed">هذه الميزة تحت التطوير النشط حالياً من قبل فريق منصة شحنتي التقني.</p>
    </div>
)

const Unauthorized = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-slate-50 font-cairo" dir="rtl">
        <h1 className="text-9xl font-black text-slate-200/50 mb-0 pointer-events-none">403</h1>
        <div className="relative -mt-10">
            <h2 className="text-3xl font-black text-slate-900 mb-3">وصول غير مصرح به</h2>
            <p className="text-slate-500 font-bold mb-10 max-w-md mx-auto">عذراً، لا تمتلك الصلاحيات الكافية للوصول إلى هذه المنطقة من المنصة.</p>
            <button
                onClick={() => window.history.back()}
                className="px-10 h-14 bg-brand-primary text-white rounded-2xl font-black shadow-2xl shadow-brand-primary/20 hover:-translate-y-1 transition-all"
            >
                العودة للمكان الآمن
            </button>
        </div>
    </div>
)



function App() {
    const { theme } = useThemeStore()

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    return (
        <>
            <SocketSync />
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: '600',
                    },
                    success: {
                        duration: 4000,
                    },
                    error: {
                        duration: 4000,
                    }
                }}
            />
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Roles with Protection */}
                    {[
                        { role: 'customer', path: '/customer' },
                        { role: 'driver', path: '/driver' },
                        { role: 'company', path: '/company' },
                        { role: 'governorate', path: '/gov' }
                    ].map(({ role, path }) => (
                        <Route
                            key={role}
                            path={`${path}/*`}
                            element={
                                <ProtectedRoute allowedRoles={[role]}>
                                    <DashboardLayout>
                                        <Routes>
                                            {role === 'customer' ? (
                                                <>
                                                    <Route path="/" element={<CustomerDashboard />} />
                                                    <Route path="/shipments" element={<ShipmentsPage />} />
                                                    <Route path="/shipments/:id" element={<ShipmentDetailsPage />} />
                                                    <Route path="/create" element={<CreateShipmentPage />} />
                                                    <Route path="/edit/:id" element={<CreateShipmentPage />} />
                                                    <Route path="/bids" element={<IncomingOffersPage />} />
                                                    <Route path="/bids/:id" element={<BiddingInterface />} />
                                                    <Route path="/tracking" element={<ShipmentTracking />} />
                                                    <Route path="/tracking/:id" element={<ShipmentTracking />} />
                                                    <Route path="/report" element={<ReportIssuePage />} />
                                                    <Route path="/reports-history" element={<AllReportsPage />} />
                                                    <Route path="/profile" element={<ProfilePage />} />
                                                    <Route path="*" element={<Placeholder title="قيد التطوير" />} />

                                                </>
                                            ) : role === 'driver' ? (
                                                <>
                                                    <Route path="/" element={<DriverDashboard />} />
                                                    <Route path="/available" element={<AvailableShipments />} />
                                                    <Route path="/available/:id" element={<DriverShipmentDetails />} />
                                                    <Route path="/active" element={<ActiveShipments />} />
                                                    <Route path="/alerts" element={<RoadAlerts />} />
                                                    <Route path="/reports" element={<DriverReports />} />
                                                    <Route path="/report" element={<ReportIssuePage />} />
                                                    <Route path="/reports-history" element={<AllReportsPage />} />
                                                    <Route path="/profile" element={<ProfilePage />} />
                                                    <Route path="*" element={<Placeholder title="قيد التطوير" />} />

                                                </>
                                            ) : role === 'company' ? (
                                                <>
                                                    <Route path="/" element={<FleetManagement />} />
                                                    <Route path="/fleet" element={<FleetManagement />} />
                                                    <Route path="/drivers" element={<DriverManagement />} />
                                                    <Route path="/contracts" element={<DigitalContracts />} />
                                                    <Route path="/profile" element={<ProfilePage />} />
                                                    <Route path="*" element={<Placeholder title="قيد التطوير" />} />

                                                </>
                                            ) : role === 'governorate' ? (
                                                <>
                                                    <Route path="/" element={<GovDashboard />} />
                                                    <Route path="/fees" element={<GovDashboard />} />
                                                    <Route path="/profile" element={<ProfilePage />} />
                                                    <Route path="*" element={<Placeholder title="قيد التطوير" />} />

                                                </>
                                            ) : (
                                                <>
                                                    <Route path="/" element={<Placeholder title={`لوحة تحكم ${role}`} />} />
                                                    <Route path="*" element={<Placeholder title="قيد التطوير" />} />
                                                </>
                                            )}
                                        </Routes>
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                    ))}

                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <DashboardLayout>
                                    <Routes>
                                        <Route path="/" element={<AdminDashboard />} />
                                        <Route path="/users" element={<AdminDashboard />} />
                                        <Route path="/verification" element={<DriverVerification />} />
                                        <Route path="/operations" element={<PlatformManagement />} />
                                        <Route path="/reports" element={<AdminReports />} />
                                        <Route path="/disputes" element={<DisputeResolution />} />
                                        <Route path="/contracts" element={<DigitalContracts />} />
                                        <Route path="/settings" element={<SystemSettings />} />
                                        <Route path="/profile" element={<ProfilePage />} />
                                        <Route path="*" element={<Placeholder title="قيد التطوير" />} />
                                    </Routes>
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </>
    )
}

export default App

