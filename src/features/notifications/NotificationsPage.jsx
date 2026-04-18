import { useState, useEffect } from 'react'
import { 
    Bell, 
    CheckCircle2, 
    AlertTriangle, 
    Info, 
    X, 
    Trash2, 
    Check, 
    CreditCard,
    Filter
} from 'lucide-react'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useAuthStore } from '@/store/useAuthStore'
import { notificationService } from '@/services/notificationService'
import { cn } from '@/utils/cn'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

export const NotificationsPage = () => {
    const { role } = useAuthStore()
    const { 
        notifications, 
        setNotifications, 
        markAsRead, 
        removeNotification, 
        clearAll 
    } = useNotificationStore()

    const [selectedNotification, setSelectedNotification] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isDetailLoading, setIsDetailLoading] = useState(false)
    const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'

    // Fetch notifications if store is empty or for fresh data
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await notificationService.getUserNotifications();
                const data = res.data || res || [];
                setNotifications(data);
            } catch (err) {
                console.warn('Failed to fetch notifications:', err);
            }
        };
        fetchNotifications();
    }, [setNotifications]);

    const filteredList = (notifications ?? [])
        .filter(n => !n.recipientRole || n.recipientRole === role)
        .filter(n => {
            if (filter === 'unread') return n.active;
            if (filter === 'read') return !n.active;
            return true;
        })
        .sort((a, b) => new Date(b.createDateTime || b.createdAt) - new Date(a.createDateTime || a.createdAt));

    const handleNotificationClick = async (notif) => {
        setIsDetailModalOpen(true)
        setIsDetailLoading(true)
        try {
            const res = await notificationService.getNotificationDetail(notif.id)
            setSelectedNotification(res.data || res || notif)
            markAsRead(notif.id)
        } catch (err) {
            console.warn('Failed to fetch detail, using local data')
            setSelectedNotification(notif)
            markAsRead(notif.id)
        } finally {
            setIsDetailLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 font-cairo" dir="rtl">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">إشعارات النظام</h1>
                    <p className="text-slate-500 font-bold">تابع كل التحديثات والتحركات الخاصة بحسابك في مكان واحد.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => clearAll(role)}
                        className="flex items-center gap-2 px-6 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl font-black text-sm hover:bg-rose-100 transition-all cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4" />
                        مسح الكل
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-8 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit">
                {[
                    { id: 'all', label: 'الكل' },
                    { id: 'unread', label: 'غير مقروء' },
                    { id: 'read', label: 'تمت القراءة' }
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={cn(
                            "px-6 py-2 rounded-xl text-sm font-black transition-all cursor-pointer",
                            filter === f.id 
                                ? "bg-white dark:bg-slate-700 text-brand-primary shadow-sm" 
                                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredList.length > 0 ? (
                    filteredList.map((notif, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={cn(
                                "group relative bg-white dark:bg-slate-900 border transition-all p-8 rounded-[2rem] cursor-pointer",
                                notif.active 
                                    ? "border-brand-primary/20 bg-brand-primary/[0.03] dark:bg-brand-primary/[0.08] border-r-4 border-r-brand-primary" 
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                            )}
                        >
                            <div className="flex items-start gap-6">
                                {/* Icon container */}
                                <div className={cn(
                                    "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110",
                                    (notif.type === 'success' || notif.type === 'offer_accepted') ? "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10" :
                                    (notif.type === 'warning' || notif.type === 'alert') ? "bg-amber-500/10 text-amber-500 shadow-amber-500/10" :
                                    notif.type === 'new_bid' ? "bg-indigo-500/10 text-indigo-500 shadow-indigo-500/10" :
                                    "bg-blue-500/10 text-blue-500 shadow-blue-500/10"
                                )}>
                                    {(notif.type === 'success' || notif.type === 'offer_accepted') ? <CheckCircle2 className="h-7 w-7" /> :
                                     (notif.type === 'warning' || notif.type === 'alert') ? <AlertTriangle className="h-7 w-7" /> :
                                     notif.type === 'new_bid' ? <CreditCard className="h-7 w-7" /> :
                                     <Info className="h-7 w-7" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <h3 className={cn(
                                            "text-lg leading-tight truncate",
                                            notif.active ? "font-black text-slate-900 dark:text-white" : "font-bold text-slate-600 dark:text-slate-400"
                                        )}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full shrink-0">
                                            {formatDistanceToNow(new Date(notif.createDateTime || notif.createdAt || new Date()), { addSuffix: true, locale: ar })}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-sm leading-relaxed line-clamp-2 max-w-3xl",
                                        notif.active ? "text-slate-600 dark:text-slate-300 font-bold" : "text-slate-500 dark:text-slate-500 font-medium"
                                    )}>
                                        {notif.body || notif.desc || notif.message}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                        className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-all"
                                        title="حذف"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Unread indicator */}
                            {notif.active && (
                                <div className="absolute top-6 left-6 h-3 w-3 bg-brand-primary rounded-full animate-pulse shadow-glow shadow-brand-primary/50"></div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Bell className="h-10 w-10 text-slate-200" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">لا توجد إشعارات</h2>
                        <p className="text-slate-500 font-bold max-w-xs">عند تلقي أي تنبيهات جديدة ستظهر هنا مباشرة.</p>
                    </div>
                )}
            </div>

            {/* Notification Detail Modal (Portal) */}
            {isDetailModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDetailModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
                        />
                    </AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-200/50 dark:border-slate-800 overflow-hidden"
                    >
                        {isDetailLoading ? (
                            <div className="p-20 text-center">
                                <div className="h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-500 font-bold">جاري تحميل التفاصيل...</p>
                            </div>
                        ) : selectedNotification ? (
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg",
                                            (selectedNotification.type === 'success' || selectedNotification.type === 'offer_accepted') ? "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10" :
                                            (selectedNotification.type === 'warning' || selectedNotification.type === 'alert') ? "bg-amber-500/10 text-amber-500 shadow-amber-500/10" :
                                            selectedNotification.type === 'new_bid' ? "bg-indigo-500/10 text-indigo-500 shadow-indigo-500/10" :
                                            "bg-blue-500/10 text-blue-500 shadow-blue-500/10"
                                        )}>
                                            {(selectedNotification.type === 'success' || selectedNotification.type === 'offer_accepted') ? <CheckCircle2 className="h-7 w-7" /> :
                                             (selectedNotification.type === 'warning' || selectedNotification.type === 'alert') ? <AlertTriangle className="h-7 w-7" /> :
                                             selectedNotification.type === 'new_bid' ? <CreditCard className="h-7 w-7" /> :
                                             <Info className="h-7 w-7" />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                                {selectedNotification.title}
                                            </h3>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                                                {formatDistanceToNow(new Date(selectedNotification.createDateTime || selectedNotification.createdAt || new Date()), { addSuffix: true, locale: ar })}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsDetailModalOpen(false)}
                                        className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 mb-8">
                                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed font-bold">
                                        {selectedNotification.body || selectedNotification.desc || selectedNotification.message}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsDetailModalOpen(false)}
                                        className="grow bg-brand-primary hover:bg-brand-primary/90 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
                                    >
                                        فهمت ذلك
                                    </button>
                                    <button
                                        onClick={() => {
                                            removeNotification(selectedNotification.id);
                                            setIsDetailModalOpen(false);
                                        }}
                                        className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-500 font-bold py-4 px-6 rounded-2xl transition-all cursor-pointer"
                                    >
                                        حذف الإشعار
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </motion.div>
                </div>,
                document.body
            )}
        </div>
    )
}
