import { useState, useRef, useEffect } from 'react'
import {
    Bell,
    Search,
    Moon,
    Sun,
    User,
    Menu,
    X,
    LogOut,
    Settings,
    ChevronDown,
    CheckCircle2,
    AlertTriangle,
    Info,
    CreditCard
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useUIStore } from '@/store/useUIStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { cn } from '@/utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

export const Topbar = () => {
    const { user, logout, role } = useAuthStore()
    const { theme, toggleTheme } = useThemeStore()
    const { toggleSidebar, isSidebarOpen } = useUIStore()
    const { notifications, clearAll, markAsRead, removeNotification } = useNotificationStore()

    // Filter notifications based on role
    const filteredNotifications = (notifications ?? []).filter(n => !n.recipientRole || n.recipientRole === role)
    const activeNotifications = filteredNotifications.filter(n => n.active)

    const navigate = useNavigate()

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const notificationRef = useRef(null)
    const userMenuRef = useRef(null)

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false)
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Dynamic notifications used from store

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getRoleName = (r) => {
        const roles = {
            'client': 'عميل',
            'driver': 'سائق',
            'governorate': 'المحافظة',
            'admin': 'مدير النظام',
            'company': 'شركة',
            'customer': 'عميل'
        }
        return roles[r] || 'مستخدم'
    }

    return (
        <header className="h-16 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 font-cairo shadow-sm shadow-slate-200/5 transition-colors duration-300">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                    {isSidebarOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
                </button>

                <div className="flex-1 max-w-[320px] hidden lg:block">
                    <div className="relative group">
                        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="بحث سريع في المنصة..."
                            className="w-full h-10 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/20 dark:border-slate-700/50 rounded-xl pr-10 pl-4 text-[12px] font-bold focus:bg-white dark:focus:bg-slate-900 focus:border-brand-primary/30 transition-all outline-none dark:text-slate-200"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <button
                    onClick={toggleTheme}
                    className="h-10 w-10 flex items-center justify-center text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-700/50 rounded-xl transition-all group"
                    title={theme === 'light' ? 'الوضع الليلي' : 'الوضع المضيء'}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={theme}
                            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {theme === 'light' ? (
                                <Moon className="h-4.5 w-4.5 group-hover:text-brand-primary transition-colors" />
                            ) : (
                                <Sun className="h-4.5 w-4.5 group-hover:text-amber-500 transition-colors" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </button>

                <div className="flex items-center gap-3 md:gap-4 relative">
                    {/* Notifications Button */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={cn(
                                "h-10 w-10 flex items-center justify-center rounded-xl transition-all relative group",
                                isNotificationsOpen ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/40 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <Bell className={cn("h-4.5 w-4.5 transition-transform", !isNotificationsOpen && "group-hover:rotate-12")} />
                            {activeNotifications.length > 0 && (
                                <span className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] bg-[#eb6a1d] text-white text-[10px] font-black rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center px-1 animate-bounce">
                                    {activeNotifications.length}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="fixed md:absolute inset-x-4 md:inset-x-auto md:left-0 top-[70px] md:top-full mt-2 md:mt-4 w-auto md:w-[380px] max-w-[calc(100vw-32px)] md:max-w-none mx-auto md:mx-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-[1.5rem] overflow-hidden origin-top z-50 ring-1 ring-black/5 dark:ring-white/5"
                                >
                                    <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                                        <h4 className="font-black text-slate-900 dark:text-white text-sm">التنبيهات</h4>
                                        <button
                                            onClick={() => clearAll(role)}
                                            className="text-[10px] font-black text-slate-400 hover:text-brand-primary bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg uppercase tracking-wider transition-colors"
                                        >
                                            مسح الكل
                                        </button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {filteredNotifications.length > 0 ? (
                                            filteredNotifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => markAsRead(notif.id)}
                                                    className={cn(
                                                        "p-5 transition-all border-b border-slate-50 dark:border-slate-800/60 cursor-pointer group relative",
                                                        notif.active ? "bg-slate-50/50 dark:bg-slate-800/50" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                                                    )}
                                                >
                                                    {/* Unread Indicator Dot */}
                                                    {notif.active && (
                                                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(235,106,29,0.5)]"></span>
                                                    )}

                                                    <div className="flex gap-4 pl-10">
                                                        {/* Icon with refined styling */}
                                                        <div className={cn(
                                                            "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-sm transition-transform group-hover:scale-105",
                                                            notif.type === 'success' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100/50 dark:border-emerald-500/20" :
                                                                notif.type === 'warning' ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100/50 dark:border-amber-500/20" :
                                                                    "bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-100/50 dark:border-blue-500/20"
                                                        )}>
                                                            {notif.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> :
                                                                notif.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                                                        </div>

                                                        {/* Content Body */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-1 gap-2">
                                                                <h5 className={cn(
                                                                    "text-[13px] leading-snug truncate",
                                                                    notif.active ? "font-black text-slate-900 dark:text-white" : "font-bold text-slate-600 dark:text-slate-300"
                                                                )}>
                                                                    {notif.title}
                                                                </h5>
                                                                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap pt-0.5">
                                                                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ar })}
                                                                </span>
                                                            </div>
                                                            <p className={cn(
                                                                "text-[11px] leading-relaxed line-clamp-2",
                                                                notif.active ? "text-slate-600 dark:text-slate-300 font-bold" : "text-slate-500 dark:text-slate-400 font-medium"
                                                            )}>
                                                                {notif.desc}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Unified Delete Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notif.id);
                                                        }}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-40 group-hover:opacity-100"
                                                        title="حذف التنبيه"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center">
                                                <Bell className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-slate-400">لا توجد تنبيهات جديدة</p>
                                            </div>
                                        )}
                                    </div>
                                    <button className="w-full p-4 text-center text-[11px] font-black text-slate-400 hover:text-brand-primary transition-colors bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-t border-slate-50 dark:border-slate-800 uppercase tracking-widest">
                                        مشاهدة جميع الاشعارات
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

                    {/* User Profile Button */}
                    <div className="relative" ref={userMenuRef}>
                        <div
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-slate-800/80 p-1.5 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                        >
                            <div className="text-left hidden lg:block mr-1">
                                <p className="text-[12px] font-black text-slate-900 dark:text-slate-100 leading-none group-hover:text-brand-primary transition-colors">
                                    {user?.full_name || 'مستخدم النظام'}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{getRoleName(user?.role || role)}</p>
                            </div>
                            <div className="relative">
                                <div className="h-10 w-10 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-brand-primary dark:text-brand-primary group-hover:border-brand-primary shadow-sm overflow-hidden text-sm font-bold transition-all">
                                    {(user?.driverDetails?.profile_picture || user?.profile_picture || user?.avatar || user?.image) ? (
                                        <img 
                                            src={user?.driverDetails?.profile_picture || user?.profile_picture || user?.avatar || user?.image} 
                                            alt={user?.full_name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.onerror = null; e.target.src = ''; e.target.parentElement.innerHTML = user?.full_name?.charAt(0) || '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'; }}
                                        />
                                    ) : (
                                        user?.full_name?.charAt(0) || <User className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute left-0 top-full mt-4 w-[260px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-[1.5rem] overflow-hidden origin-top-right z-50 ring-1 ring-black/5 dark:ring-white/5"
                                >
                                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-12 w-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center font-black text-brand-primary shadow-sm overflow-hidden">
                                                {(user?.driverDetails?.profile_picture || user?.profile_picture || user?.avatar || user?.image) ? (
                                                    <img src={user?.driverDetails?.profile_picture || user?.profile_picture || user?.avatar || user?.image} alt={user?.full_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    user?.full_name?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-black text-slate-900 dark:text-white text-sm leading-none mb-1.5 truncate max-w-[140px]">{user?.full_name || 'المستخدم'}</h5>
                                                <p className="text-[10px] font-bold text-slate-500 mb-1.5 truncate max-w-[140px]">{user?.email}</p>
                                                <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{getRoleName(user?.role || role)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-xl text-center">
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">الرصيد</p>
                                                <p className="text-xs font-black text-slate-900 dark:text-white">٠ EGP</p>
                                            </div>
                                            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-xl text-center">
                                                <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">التقييم</p>
                                                <p className="text-[10px] font-black text-slate-900 dark:text-white">غير مقيم</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2 space-y-1 bg-white dark:bg-slate-900">
                                        <button
                                            onClick={() => { navigate(`/${role === 'client' ? 'customer' : role}/profile`); setIsUserMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-primary hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 rounded-xl transition-all group"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                                <User className="h-4 w-4" />
                                            </div>
                                            ملف التعريف
                                        </button>
                                        <button
                                            onClick={() => { navigate(`/${role === 'client' ? 'customer' : role}/settings`); setIsUserMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-primary hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 rounded-xl transition-all group"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                                <Settings className="h-4 w-4" />
                                            </div>
                                            الإعدادات
                                        </button>
                                        <button
                                            onClick={() => { navigate(`/${role === 'client' ? 'customer' : role}/billing`); setIsUserMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-primary hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 rounded-xl transition-all group"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                                <CreditCard className="h-4 w-4" />
                                            </div>
                                            المحفظة والفواتير
                                        </button>
                                    </div>

                                    <div className="p-2 mt-1 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all group"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                                                <LogOut className="h-4 w-4" />
                                            </div>
                                            تسجيل الخروج
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    )
}
