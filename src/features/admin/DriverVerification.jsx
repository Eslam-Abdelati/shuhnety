import { useState, useEffect } from 'react'
import { 
    FileText, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ShieldCheck, 
    User, 
    Truck, 
    AlertCircle,
    Eye,
    Download,
    Phone,
    MapPin,
    Calendar,
    ChevronRight,
    Search,
    ThumbsUp,
    ThumbsDown,
    ArrowLeftRight,
    Briefcase
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useNotificationStore } from '@/store/useNotificationStore'
import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

export const DriverVerification = () => {
    const { addNotification } = useNotificationStore()
    const [pendingDrivers, setPendingDrivers] = useState([])
    const [selectedDriver, setSelectedDriver] = useState(null)
    const [showRejectionModal, setShowRejectionModal] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')
    const [checkedDocs, setCheckedDocs] = useState({})
    const [viewingDoc, setViewingDoc] = useState(null)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('registered_users') || '[]')
        const filtered = stored.filter(u => u.role === 'driver' && u.status === 'pending')
        setPendingDrivers(filtered)
    }, [])

    const handleVerify = (email, status, reason = '') => {
        const stored = JSON.parse(localStorage.getItem('registered_users') || '[]')
        const updated = stored.map(u => 
            u.email.toLowerCase() === email.toLowerCase() ? { 
                ...u, 
                status, 
                verificationNotes: reason,
                verifiedAt: new Date().toISOString() 
            } : u
        )
        localStorage.setItem('registered_users', JSON.stringify(updated))
        setPendingDrivers(updated.filter(u => u.role === 'driver' && u.status === 'pending'))
        setSelectedDriver(null)
        setShowRejectionModal(false)
        setRejectionReason('')
        setCheckedDocs({})

        addNotification({
            title: status === 'accepted' ? 'تم التفعيل بنجاح' : 'تم رفض الطلب',
            desc: status === 'accepted' ? `السائق ${email} متاح الآن للعمل على المنصة.` : `تم إرسال سبب الرفض للسائق ${email}.`,
            type: status === 'accepted' ? 'success' : 'error'
        })
    }

    const toggleDocCheck = (label) => {
        setCheckedDocs(prev => ({ ...prev, [label]: !prev[label] }))
    }

    const allDocsChecked = selectedDriver && 
        ['البطاقة الشخصية', 'رخصة القيادة', 'رخصة السيارة'].every(doc => checkedDocs[doc]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-cairo pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">مركز تدقيق بيانات السائقين</h1>
                    <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm font-bold">
                        <ShieldCheck className="h-4 w-4 text-brand-primary" />
                        <span>نظام التحقق الذكي • {pendingDrivers.length} طلبات معلقة</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4">
                {/* List of Pending Drivers */}
                <div className="xl:col-span-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">طلبات بانتظار المراجعة</h3>
                        <div className="h-6 px-2 bg-slate-100 rounded-md flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {pendingDrivers.length} فحص
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {pendingDrivers.map((driver) => (
                            <motion.div
                                key={driver.email}
                                layoutId={driver.email}
                                onClick={() => setSelectedDriver(driver)}
                                className={cn(
                                    "p-5 rounded-[2.5rem] cursor-pointer transition-all border-2 group relative overflow-hidden",
                                    selectedDriver?.email === driver.email 
                                        ? "bg-white border-brand-primary shadow-2xl shadow-brand-primary/10 scale-[1.02] z-10" 
                                        : "bg-white border-transparent hover:border-slate-200"
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                                        selectedDriver?.email === driver.email ? "bg-brand-primary text-white" : "bg-slate-50 text-slate-300"
                                    )}>
                                        <User className="h-7 w-7" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-black text-slate-900 truncate text-base mb-0.5">{driver.fullName}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 truncate">{driver.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="bg-amber-50 px-2 py-1 rounded-lg flex items-center gap-1.5 text-amber-500">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-[9px] font-black tracking-tight">منذ يوم</span>
                                        </div>
                                        <ChevronRight className={cn(
                                            "h-5 w-5 transition-transform",
                                            selectedDriver?.email === driver.email ? "translate-x-0 rotate-180 text-brand-primary" : "translate-x-4 opacity-0"
                                        )} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {pendingDrivers.length === 0 && (
                            <div className="p-16 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-5">
                                <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 animate-bounce">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-black text-slate-900">عمل رائع!</p>
                                    <p className="text-xs font-bold text-slate-400">لا توجد طلبات معلقة بانتظار المراجعة حالياً.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Review Section */}
                <div className="xl:col-span-8">
                    <AnimatePresence mode="wait">
                        {selectedDriver ? (
                            <motion.div
                                key={selectedDriver.email}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="space-y-6"
                            >
                                {/* Main Card */}
                                <Card className="rounded-[3.5rem] border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 bg-white overflow-hidden">
                                    <div className="p-8 md:p-12 space-y-10">
                                        {/* Identity Header */}
                                        <div className="flex flex-col md:flex-row md:items-center gap-8 border-b border-slate-50 pb-10">
                                            <div className="relative">
                                                <div className="h-32 w-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2.8rem] flex items-center justify-center text-slate-300 border border-slate-100 italic font-black text-4xl shadow-inner overflow-hidden">
                                                    {selectedDriver.fullName.charAt(0)}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-brand-primary text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="space-y-4 flex-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedDriver.fullName}</h2>
                                                    <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse" />
                                                        ملف قيد التدقيق
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest uppercase mb-1">البريد الإلكتروني</p>
                                                        <p className="text-sm font-black text-slate-700 truncate">{selectedDriver.email}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest uppercase mb-1">تاريخ التسجيل</p>
                                                        <p className="text-sm font-black text-slate-700">03 ابريل 2024</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest uppercase mb-1">الموقع المتوقع</p>
                                                        <p className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                                                            <MapPin className="h-3.5 w-3.5 text-brand-primary" /> القاهرة
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest uppercase mb-1">رقم الهاتف</p>
                                                        <p className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                                                            <Phone className="h-3.5 w-3.5 text-brand-primary" /> 01092834712
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dashboard Body Split */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            {/* LEFT: Documents Checklist */}
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between pr-4">
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">فحص المستندات الرسمية</h3>
                                                    <p className="text-[10px] font-bold text-brand-primary">يجب فحص الكل قبل التفعيل</p>
                                                </div>
                                                <div className="space-y-3">
                                                    {[
                                                        { id: 'id_card', label: 'البطاقة الشخصية', icon: User, status: 'uploaded' },
                                                        { id: 'license', label: 'رخصة القيادة', icon: FileText, status: 'uploaded' },
                                                        { id: 'car_license', label: 'رخصة السيارة', icon: Truck, status: 'uploaded' },
                                                        { id: 'criminal_record', label: 'الفيش الجنائي', icon: ShieldCheck, status: 'pending' },
                                                    ].map((doc, i) => (
                                                        <div 
                                                            key={i} 
                                                            onClick={() => toggleDocCheck(doc.label)}
                                                            className={cn(
                                                                "p-6 rounded-[2.2rem] border-2 transition-all group flex items-center justify-between cursor-pointer",
                                                                checkedDocs[doc.label] ? "bg-emerald-50/30 border-emerald-100" : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn(
                                                                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm border transition-colors",
                                                                    checkedDocs[doc.label] ? "bg-white border-emerald-200 text-emerald-500" : "bg-white border-slate-100 text-slate-400"
                                                                )}>
                                                                    <doc.icon className="h-6 w-6" />
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <p className={cn("text-xs font-black transition-colors", checkedDocs[doc.label] ? "text-emerald-700" : "text-slate-700")}>{doc.label}</p>
                                                                    {doc.status === 'uploaded' ? (
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); setViewingDoc(doc.label) }}
                                                                            className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                                                                        >
                                                                            <Eye className="h-3 w-3" /> استعراض الملف
                                                                        </button>
                                                                    ) : (
                                                                        <p className="text-[10px] font-bold text-slate-400">لم يتم الرفع</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className={cn(
                                                                "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                                                                checkedDocs[doc.label] ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-300"
                                                            )}>
                                                                <CheckCircle2 className="h-5 w-5" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* RIGHT: Vehicle & Info */}
                                            <div className="space-y-8">
                                                <div className="space-y-6">
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">تفاصيل الشاحنة والرحلات</h3>
                                                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                                        <Truck className="absolute -bottom-10 -left-10 h-40 w-40 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                                                        <div className="relative z-10 space-y-6">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">نوع الشاحنة</span>
                                                                <span className="bg-brand-primary px-3 py-1 rounded-lg text-[9px] font-black">جامبو - ثلاجة</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-8">
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-slate-400">رقم اللوحة</p>
                                                                    <p className="text-xl font-black tracking-widest">أ ب ط 9283</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-slate-400">سعة الحمولة</p>
                                                                    <p className="text-xl font-black">7.5 طن</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-slate-400">موديل السنة</p>
                                                                    <p className="text-xl font-black">2023</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-bold text-slate-400">إجمالي الرحلات</p>
                                                                    <p className="text-xl font-black">0 رحلة</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Audit Timeline */}
                                                <div className="space-y-6">
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">سجل المراجعة</h3>
                                                    <div className="space-y-4 px-4">
                                                        {[
                                                            { date: 'اليوم، 10:30 ص', text: 'تم تسجيل الحساب وتحميل المستندات', icon: Briefcase },
                                                            { date: 'اليوم، 11:15 ص', text: 'بدأ تدقيق البيانات من قبل فريق الإدارة', icon: Search },
                                                        ].map((item, i) => (
                                                            <div key={i} className="flex gap-4 relative">
                                                                {i < 1 && <div className="absolute top-6 left-2.5 bottom-0 w-0.5 bg-slate-100" />}
                                                                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 relative z-10">
                                                                    <item.icon className="h-3 w-3" />
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <p className="text-[10px] font-black text-slate-900 leading-none">{item.text}</p>
                                                                    <p className="text-[9px] font-bold text-slate-400">{item.date}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Action Bar Container */}
                                        <div className="pt-10 border-t border-slate-100">
                                            <div className="flex flex-col md:flex-row items-center gap-6">
                                                <div className="flex-1 space-y-1">
                                                    <h5 className="text-sm font-black text-slate-900">تأكيد حالة الانضمام</h5>
                                                    <p className="text-[10px] font-bold text-slate-400">بتفعيل السائق، أنت تؤكد صحة البيانات والمستندات المقدمة أعلاه.</p>
                                                </div>
                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    <Button 
                                                        variant="outline"
                                                        onClick={() => setShowRejectionModal(true)}
                                                        className="flex-1 h-16 border-rose-100 text-rose-500 hover:bg-rose-50 rounded-[1.5rem] font-black text-sm transition-all px-8 shadow-none"
                                                    >
                                                        <ThumbsDown className="ml-2 h-4 w-4" /> رفض الطلب
                                                    </Button>
                                                    <Button 
                                                        disabled={!allDocsChecked}
                                                        onClick={() => handleVerify(selectedDriver.email, 'accepted')}
                                                        className={cn(
                                                            "flex-1 h-16 text-white rounded-[1.5rem] font-black text-sm px-10 transition-all border-none relative overflow-hidden",
                                                            allDocsChecked 
                                                                ? "bg-emerald-500 shadow-xl shadow-emerald-200" 
                                                                : "bg-slate-300 cursor-not-allowed opacity-70"
                                                        )}
                                                    >
                                                        <ThumbsUp className="ml-2 h-4 w-4" /> تفعيل السائق
                                                        {!allDocsChecked && <div className="absolute inset-0 bg-slate-400/5 backdrop-blur-[1px]" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-[75vh] flex flex-col items-center justify-center p-20 bg-white/40 rounded-[4rem] border-2 border-dashed border-slate-100 text-center">
                                <div className="h-32 w-32 bg-white rounded-[3rem] flex items-center justify-center shadow-2xl text-slate-200 mb-10 font-black text-6xl transform rotate-3 italic border border-slate-50">
                                    <Truck className="h-14 w-14 text-slate-100" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">مركز التدقيق المركزي</h3>
                                <p className="text-base font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
                                    برجاء تحديد ملف أحد السائقين من القائمة الجانبية لبدء عملية المراجعة القانونية والفنية لمستندات المركبة والقيادة.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Rejection Modal Overlay */}
            <AnimatePresence>
                {showRejectionModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            onClick={() => setShowRejectionModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden text-right"
                        >
                            <div className="p-10 space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="h-14 w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                        <XCircle className="h-8 w-8" />
                                    </div>
                                    <button onClick={() => setShowRejectionModal(false)} className="p-2 text-slate-300 hover:text-slate-600">
                                        <XCircle className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900 leading-none">تحديد سبب الرفض</h3>
                                    <p className="text-sm font-bold text-slate-500">سيتم إرسال هذا السبب للسائق ليتمكن من معالجة المشكلة وإعادة الطلب.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        'المستندات المرفوعة غير واضحة (تصوير سيء)',
                                        'رخصة القيادة منتهية الصلاحية',
                                        'الفيش الجنائي غير مطابق لبيانات البطاقة',
                                        'صورة السيارة غير مطابقة للموديل المذكور',
                                    ].map((reason, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setRejectionReason(reason)}
                                            className={cn(
                                                "w-full p-5 rounded-2xl border-2 text-right text-sm font-black transition-all",
                                                rejectionReason === reason ? "bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-200/50" : "bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-600"
                                            )}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                    <div className="pt-2">
                                        <textarea 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm font-bold h-32 outline-none focus:ring-4 focus:ring-rose-500/5 transition-all text-right"
                                            placeholder="أو اكتب سبباً مخصصاً هنا..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button 
                                        onClick={() => setShowRejectionModal(false)}
                                        variant="ghost"
                                        className="h-14 flex-1 text-slate-400 font-black"
                                    >
                                        إلغاء التراجع
                                    </Button>
                                    <Button 
                                        onClick={() => handleVerify(selectedDriver.email, 'rejected', rejectionReason)}
                                        disabled={!rejectionReason}
                                        className="h-14 flex-[2] bg-rose-500 text-white rounded-2xl font-black text-base shadow-xl shadow-rose-200 border-none disabled:opacity-50"
                                    >
                                        تأكيد الرفض والإرسال
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Document Viewer Modal */}
            <AnimatePresence>
                {viewingDoc && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
                            onClick={() => setViewingDoc(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-5xl h-[80vh] rounded-[4rem] relative z-10 overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                                        <Eye className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">{viewingDoc}</h3>
                                </div>
                                <button onClick={() => setViewingDoc(null)} className="h-10 w-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                                    <XCircle className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex-1 bg-slate-100 m-8 rounded-[3rem] flex flex-col items-center justify-center border-4 border-white shadow-inner relative group">
                                <FileText className="h-32 w-32 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                                <p className="text-sm font-black text-slate-400 mt-6 tracking-widest uppercase">Document Preview Area</p>
                                <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-black text-[10px] tracking-[0.2em] uppercase">
                                    High Resolution • Secure Viewer
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
