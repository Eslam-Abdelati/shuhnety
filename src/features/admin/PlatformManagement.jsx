import { useState } from 'react'
import {
    Activity,
    Search,
    Filter,
    Package,
    ArrowUpRight,
    SearchIcon,
    AlertCircle,
    CheckCircle2,
    Clock,
    User,
    Truck,
    MapPin,
    AlertTriangle,
    Eye
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

export const PlatformManagement = () => {
    const [view, setView] = useState('all') // all, auctions, disputes
    const [searchQuery, setSearchQuery] = useState('')

    const systemAlerts = [
        { title: 'مزاد منتهي بدون تجاوب', desc: 'تم انتهاء المزاد SH-239407 بدون قبول أي عرض من قبل العميل.', type: 'warning' },
        { title: 'تأخير في التحميل', desc: 'السائق محمد أحمد متأخر في موقع التحميل لأكثر من ساعتين في شحنة SH-123048.', type: 'danger' },
        { title: 'نجاح تفعيل الربط', desc: 'تم ربط منصة شحنتي بنجاح مع بوابة الدفع الإلكتروني الجديدة.', type: 'success' },
    ]

    const shipments = [
        { id: 'SH-239407', customer: 'أحمد محمود', driver: 'محمد علي', status: 'delivered', pickup: 'القاهرة', destination: 'الإسكندرية', price: '2,500 ج.م' },
        { id: 'SH-123048', customer: 'شركة الهدى', driver: 'حسن إبراهيم', status: 'pickup_in_progress', pickup: 'المنصورة', destination: 'دمياط', price: '1,200 ج.م' },
        { id: 'SH-884920', customer: 'علي حسن', driver: 'قيد المزايدة', status: 'pending', pickup: 'أسيوط', destination: 'سوهاج', price: '---' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-cairo">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">إدارة العمليات الميدانية</h1>
                    <p className="text-sm font-bold text-slate-500 mr-1">مراقبة حية لكافة الشحنات والمزايدات النشطة على المنصة</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200"></div>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest leading-none">مراقبة حية متصلة</span>
                </div>
            </div>

            {/* Platform Alerts Bar */}
            <div className="px-4">
                <div className="flex overflow-x-auto gap-4 pb-2 custom-scrollbar">
                    {systemAlerts.map((alert, i) => (
                        <div key={i} className={cn(
                            "min-w-[320px] p-5 rounded-3xl border flex items-start gap-4 transition-all hover:scale-[1.02] cursor-default",
                            alert.type === 'warning' ? "bg-amber-50 border-amber-100" :
                            alert.type === 'danger' ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"
                        )}>
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                                alert.type === 'warning' ? "bg-amber-100 text-amber-600" :
                                alert.type === 'danger' ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                                {alert.type === 'warning' ? <Clock className="h-5 w-5" /> :
                                 alert.type === 'danger' ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-black text-slate-900 leading-none">{alert.title}</h4>
                                <p className="text-[10px] font-bold text-slate-500 leading-relaxed text-right">{alert.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipments Monitor Table */}
            <div className="px-4">
                <Card className="rounded-[3rem] border-none shadow-sm ring-1 ring-slate-100 bg-white overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-900">مراقبة الشحنات</h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">إجمالي الشحنات اليوم: 154 شحنة</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                             <div className="flex p-0.5 bg-slate-50 rounded-xl border border-slate-200/50">
                                {['all', 'active', 'finished'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setView(t)}
                                        className={cn(
                                            "px-4 py-1.5 text-[10px] font-black rounded-lg transition-all",
                                            view === t ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"
                                        )}
                                    >
                                        {t === 'all' ? 'الكل' : t === 'active' ? 'نشطة' : 'منتهية'}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none" />
                                <input 
                                    className="h-10 bg-slate-50/50 border-slate-100 rounded-xl pr-9 pl-4 text-[11px] font-bold outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all transition-all w-[240px]"
                                    placeholder="بحث برقم الشحنة أو العميل..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="bg-slate-50/30 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-50/50">
                                    <th className="px-8 py-5">المعرف</th>
                                    <th className="px-8 py-5 text-right">العميل / السائق</th>
                                    <th className="px-8 py-5">المسار</th>
                                    <th className="px-8 py-5">الحالة</th>
                                    <th className="px-8 py-5">القيمة</th>
                                    <th className="px-8 py-5 text-left">التفاصيل</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {shipments.map((shipment, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-[11px] font-black text-slate-900 bg-slate-100/50 px-2.5 py-1 rounded-lg border border-slate-200/20 group-hover:bg-brand-primary/10 group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all font-mono">
                                                {shipment.id}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-800">{shipment.customer}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                                                    <Truck className="h-2.5 w-2.5" /> {shipment.driver}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                                                <span>{shipment.pickup}</span>
                                                <div className="h-px w-6 bg-slate-100 relative">
                                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 w-1 bg-slate-200 rounded-full"></div>
                                                    <div className="absolute top-1/2 -translate-y-1/2 right-0 h-1 w-1 bg-slate-200 rounded-full"></div>
                                                </div>
                                                <span>{shipment.destination}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                                shipment.status === 'delivered' ? "bg-emerald-50 text-emerald-600" :
                                                shipment.status === 'pickup_in_progress' ? "bg-blue-50 text-blue-600 animate-pulse" : "bg-amber-50 text-amber-600"
                                            )}>
                                                <div className={cn("h-1.5 w-1.5 rounded-full", shipment.status === 'delivered' ? "bg-emerald-500" : shipment.status === 'pickup_in_progress' ? "bg-blue-500" : "bg-amber-500")} />
                                                {shipment.status === 'delivered' ? 'مكتملة' : shipment.status === 'pickup_in_progress' ? 'قيد التنفيذ' : 'انتظار'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[11px] font-black text-slate-900 tracking-tight leading-none">{shipment.price}</span>
                                        </td>
                                        <td className="px-8 py-5 text-left">
                                            <button className="h-8 w-8 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-brand-primary hover:border-brand-primary/30 transition-all shadow-sm active:scale-95 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-8 border-t border-slate-50 flex items-center justify-center">
                         <button className="text-[10px] font-black text-brand-primary hover:underline underline-offset-8 transition-all flex items-center gap-2">عرض كافة السجلات التاريخية <ArrowUpRight className="h-3.5 w-3.5" /></button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

const ShieldCheck = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
)
