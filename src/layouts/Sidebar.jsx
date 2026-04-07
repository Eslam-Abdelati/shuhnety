import { Link, useLocation } from 'react-router-dom'
import {
    BarChart3,
    Package,
    Truck,
    Users,
    Settings,
    LogOut,
    LayoutDashboard,
    PlusSquare,
    FileSearch,
    Wallet,
    Building2,
    ShieldCheck,
    AlertTriangle,
    MapPin,
    X
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'

const navigation = {
    customer: [
        { name: 'لوحة التحكم', href: '/customer', icon: LayoutDashboard },
        { name: 'إنشاء شحنة', href: '/customer/create', icon: PlusSquare },
        { name: 'شحناتي', href: '/customer/shipments', icon: Package },
        { name: 'العروض', href: '/customer/bids', icon: FileSearch },
        { name: 'تتبع الشحنات', href: '/customer/tracking', icon: MapPin },
        { name: 'الإعدادات', href: '/customer/settings', icon: Settings },
    ],
    driver: [
        { name: 'الرئيسية', href: '/driver', icon: LayoutDashboard },
        { name: 'شحنات متاحة', href: '/driver/available', icon: FileSearch },
        { name: 'سجل رحلاتي', href: '/driver/active', icon: Truck },
        { name: 'تنبيهات الطريق', href: '/driver/alerts', icon: AlertTriangle },
        { name: 'الأرباح', href: '/driver/earnings', icon: Wallet },
        { name: 'الحساب', href: '/driver/profile', icon: Users },
    ],
    company: [
        { name: 'الأسطول', href: '/company', icon: Truck },
        { name: 'السائقين', href: '/company/drivers', icon: Users },
        { name: 'العقود الرقمية', href: '/company/contracts', icon: ShieldCheck },
        { name: 'التقارير', href: '/company/reports', icon: BarChart3 },
        { name: 'الإعدادات', href: '/company/settings', icon: Settings },
    ],
    governorate: [
        { name: 'المراقبة', href: '/gov', icon: BarChart3 },
        { name: 'إدارة الرسوم', href: '/gov/fees', icon: Wallet },
        { name: 'التحقق من الإيصالات', href: '/gov/verification', icon: ShieldCheck },
    ],
    admin: [
        { name: 'نظرة عامة', href: '/admin', icon: LayoutDashboard },
        { name: 'المستخدمين', href: '/admin/users', icon: Users },
        { name: 'مراجعة السائقين', href: '/admin/verification', icon: ShieldCheck },
        { name: 'إدارة العمليات', href: '/admin/operations', icon: Truck },
        { name: 'التقارير', href: '/admin/reports', icon: BarChart3 },
        { name: 'النزاعات', href: '/admin/disputes', icon: AlertTriangle },
        { name: 'العقود', href: '/admin/contracts', icon: FileSearch },
        { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
    ],
}

export const Sidebar = () => {
    const { role, logout } = useAuthStore()
    const { isSidebarOpen, closeSidebar } = useUIStore()
    const location = useLocation()

    const currentRole = location.pathname.startsWith('/admin') ? 'admin' : role
    const links = navigation[currentRole] || []

    return (
        <aside className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-72 flex-col bg-slate-950 text-slate-300 border-l border-white/5 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 font-cairo",
            isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

            {/* Logo Area */}
            <div className="flex h-24 items-center px-8 gap-4 mb-2 relative z-10 shrink-0 border-b border-white/5 bg-slate-950/20">
                <div className="h-10 w-10 bg-gradient-to-br from-brand-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                    <Truck className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <span className="text-xl font-black text-white tracking-tight block">شحنتي</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Logistics Enterprise</span>
                </div>
                <button onClick={closeSidebar} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto custom-scrollbar relative z-10">
                {links.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => { if (window.innerWidth < 1024) closeSidebar() }}
                            className={cn(
                                'group flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 relative',
                                isActive
                                    ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                            )}
                        >
                            <item.icon className={cn(
                                'ml-3 w-5 h-5 transition-transform duration-300',
                                isActive ? 'text-brand-primary' : 'text-slate-500 group-hover:text-slate-300'
                            )} />
                            {item.name}

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-brand-primary/5 rounded-xl -z-10"
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Footer Area */}
            <div className="p-6 mt-auto relative z-10 border-t border-white/5 bg-slate-950/40">
                {/* <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-6 group cursor-default">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-white font-black shadow-lg border border-white/10 group-hover:border-brand-primary/30 transition-colors">
                            {(role || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">الدور الحالي</p>
                            <p className="text-xs font-bold text-white truncate capitalize">{role === 'governorate' ? 'المحافظة' : role}</p>
                        </div>
                    </div>
                </div> */}

                <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 group px-4 py-3.5 text-xs font-black text-slate-400 hover:text-white bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 rounded-xl transition-all"
                >
                    <LogOut className="h-4 w-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
                    تسجيل الخروج
                </button>
            </div>
        </aside>
    )
}
