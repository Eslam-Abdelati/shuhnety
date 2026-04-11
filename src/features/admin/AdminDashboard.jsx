import { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Users,
    ShieldAlert,
    TrendingUp,
    Globe,
    Activity,
    Search,
    Filter,
    MoreVertical,
    ArrowUpRight,
    UserPlus,
    CheckCircle2,
    XCircle,
    Truck,
    Clock,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    SearchIcon,
    Building2,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

export const AdminDashboard = () => {
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState('all') // all, driver, customer, company
    const [searchQuery, setSearchQuery] = useState('')

    // 12 years senior: Encapsulate data fetching/updating
    const loadUsers = useCallback(() => {
        const stored = JSON.parse(localStorage.getItem('registered_users') || '[]')
        // Sort by date descending
        const sorted = stored.sort((a, b) => new Date(b.registeredAt || 0) - new Date(a.registeredAt || 0))
        setUsers(sorted)
    }, [])

    useEffect(() => {
        loadUsers()
        // Listen for storage changes if multiple tabs are open (good senior practice)
        window.addEventListener('storage', loadUsers)
        return () => window.removeEventListener('storage', loadUsers)
    }, [loadUsers])

    const handleUpdateUserStatus = (email, newStatus) => {
        const updatedUsers = users.map(u =>
            u.email.toLowerCase() === email.toLowerCase() ? { ...u, status: newStatus } : u
        )
        localStorage.setItem('registered_users', JSON.stringify(updatedUsers))
        setUsers(updatedUsers)

        if (newStatus === 'accepted') {
            toast.success(`تم تفعيل حساب المستخدم ${email} بنجاح`);
        } else {
            toast.success(`تم تعليق حساب المستخدم ${email} بنجاح`);
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesFilter = filter === 'all' || u.role === filter
            const matchesSearch = !searchQuery ||
                u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesFilter && matchesSearch
        })
    }, [users, filter, searchQuery])

    const kpis = [
        { label: 'إجمالي المستخدمين', value: users.length, icon: Users, color: 'blue', change: '+5 اليوم' },
        { label: 'كباتن بانتظار التفعيل', value: users.filter(u => u.role === 'driver' && u.status === 'pending').length, icon: Truck, color: 'amber', change: 'هام للغاية' },
        { label: 'نزاعات نشطة', value: '12', icon: ShieldAlert, color: 'red', change: '2 حرجة' },
        { label: 'كفاءة النظام', value: '99.9%', icon: Activity, color: 'emerald', change: 'مثالي' },
    ]

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
            {/* Professional Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">الإدارة المركزية</h1>
                    <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm font-bold">
                        <Activity className="h-4 w-4 text-emerald-500" />
                        <span>مراقبة حية للنظام • {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl h-12 px-6 flex-1 lg:flex-none border-slate-200">
                        <Globe className="ml-2 h-4 w-4" />
                        التقارير العامة
                    </Button>
                    <Button className="rounded-xl h-12 px-6 flex-1 lg:flex-none shadow-xl shadow-brand-primary/20 bg-brand-primary hover:bg-brand-primary/90">
                        <UserPlus className="ml-2 h-4 w-4" />
                        إضافة مدير
                    </Button>
                </div>
            </div>

            {/* KPI Grid - Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-slate-100/50">
                            <CardContent className="p-5 md:p-6">
                                <div className="flex justify-between items-start mb-5">
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center",
                                        kpi.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                            kpi.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                                kpi.color === 'red' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        <kpi.icon className="h-6 w-6" />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider",
                                        kpi.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                                    )}>{kpi.change}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 mb-1">{kpi.label}</p>
                                <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</h4>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* User Management Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-12 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
                        {/* Table Header Controls */}
                        <div className="p-6 border-b border-slate-50 bg-white sticky top-0 z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-900">إدارة المستخدمين</h3>
                                    <p className="text-xs font-bold text-slate-400">التحقق من بيانات الكباتن والشركات والعملاء</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Tabs Styled Selectors */}
                                    <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-200/50">
                                        {[
                                            { id: 'all', label: 'الكل' },
                                            { id: 'driver', label: 'الكباتن' },
                                            { id: 'customer', label: 'العملاء' },
                                            { id: 'company', label: 'الشركات' }
                                        ].map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setFilter(t.id)}
                                                className={cn(
                                                    "px-4 py-1.5 text-xs font-black rounded-lg transition-all",
                                                    filter === t.id ? "bg-white text-brand-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                                                )}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative flex-1 md:flex-none min-w-[200px]">
                                        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="بحث بالاسم أو البريد..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pr-10 pl-4 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-brand-primary/5 focus:bg-white transition-all transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Responsive User Table */}
                        <div className="overflow-x-auto overflow-y-hidden">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="bg-slate-50/30 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-6 py-5">المستخدم</th>
                                        <th className="px-6 py-5">النوع</th>
                                        <th className="px-6 py-5">التاريخ والوقت</th>
                                        <th className="px-6 py-5">الحالة</th>
                                        <th className="px-6 py-5 text-left">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                                            <motion.tr
                                                key={user.email}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-slate-50/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors shrink-0">
                                                            {user.fullName?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-black text-sm text-slate-900 truncate">{user.fullName}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 truncate tracking-tight">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {user.role === 'driver' && <Truck className="h-3 w-3 text-slate-400" />}
                                                        {user.role === 'customer' && <Users className="h-3 w-3 text-slate-400" />}
                                                        {user.role === 'company' && <Building2 className="h-3 w-3 text-slate-400" />}
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{user.role}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-xs font-bold">{user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('ar-EG') : 'قديماً'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black",
                                                        user.status === 'accepted' ? "bg-emerald-50 text-emerald-600" :
                                                            user.status === 'pending' ? "bg-amber-50 text-amber-600 animate-pulse" : "bg-rose-50 text-rose-600"
                                                    )}>
                                                        <div className={cn("h-1.5 w-1.5 rounded-full", user.status === 'accepted' ? "bg-emerald-500" : user.status === 'pending' ? "bg-amber-500" : "bg-rose-500")} />
                                                        {user.status === 'accepted' ? 'نشط' : user.status === 'pending' ? 'انتظار' : 'مرفوض'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-left">
                                                    <div className="flex items-center justify-end gap-2 translate-x-2 group-hover:translate-x-0 transition-transform">
                                                        {user.status === 'pending' || user.status === 'rejected' ? (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleUpdateUserStatus(user.email, 'accepted')}
                                                                className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 text-[10px] font-black gap-1.5"
                                                            >
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                تفعيل
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleUpdateUserStatus(user.email, 'rejected')}
                                                                className="h-8 border-rose-100 text-rose-500 hover:bg-rose-50 rounded-lg px-4 text-[10px] font-black gap-1.5 shadow-none"
                                                            >
                                                                <XCircle className="h-3 w-3" />
                                                                تعليق
                                                            </Button>
                                                        )}
                                                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3 grayscale opacity-30">
                                                        <Search className="h-10 w-10 text-slate-400" />
                                                        <p className="text-sm font-bold text-slate-500">لا يوجد مستخدمين يطابقون بحثك</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Pagination Stub */}
                        <div className="p-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold font-cairo">عرض {filteredUsers.length} من أصل {users.length} مستخدم</span>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg border border-slate-100 disabled:opacity-30" disabled><ChevronRight className="h-4 w-4" /></button>
                                <button className="p-2 rounded-lg border border-slate-100 disabled:opacity-30" disabled><ChevronLeft className="h-4 w-4" /></button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

