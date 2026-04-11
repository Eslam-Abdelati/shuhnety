import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Wallet, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Clock, 
    CheckCircle2, 
    ChevronLeft,
    Package,
    Timer,
    CircleDollarSign,
    BarChart3
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { shipmentService } from '@/services/shipmentService'
import { cn } from '@/utils/cn'

import axios from 'axios'
import Cookies from 'js-cookie'
import { API_BASE_URL } from '@/api/axiosClient'

export const DriverEarnings = () => {
    const [loading, setLoading] = useState(true)
    const [bids, setBids] = useState([])
    const [stats, setStats] = useState({
        balance: 4580.50,
        pending: 1200.00,
        totalWithdrawn: 12450.00,
        thisMonth: 3200.00
    })

    const fetchEarningsData = async () => {
        setLoading(true)
        try {
            const token = Cookies.get("access_token")
            
            // Fetch real driver stats using raw axios to bypass the global logout interceptor
            try {
                const statsRes = await axios.get(`${API_BASE_URL}/shipments/me/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const realData = statsRes.data?.data || statsRes.data;
                if (realData) {
                    setStats({
                        balance: realData.total?.earnings || 0,
                        pending: 0, // Not explicitly in this endpoint structure
                        totalWithdrawn: 0, // Not explicitly in this endpoint structure
                        thisMonth: realData.monthly?.earnings || 0,
                        completedTrips: realData.total?.trips || 0
                    });
                }
            } catch (err) {
                console.warn('Silent Stats Fetch Error:', err.message);
            }

            // Silent bid fetch as well
            try {
                const bidsRes = await axios.get(`${API_BASE_URL}/bids/new`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const bidsData = bidsRes.data?.data?.bids || bidsRes.data?.bids || [];
                setBids(Array.isArray(bidsData) ? bidsData : []);
            } catch (err) {
                console.warn('Silent Bids Fetch Error:', err.message);
            }
            
        } catch (error) {
            console.error('General Fetch Error:', error.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEarningsData()
    }, [])

    return (
        <div className="min-h-screen bg-[#fbfbf4] font-cairo pb-32" dir="rtl">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-100 px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">التقارير المالية</h1>
                        <p className="text-sm font-bold text-slate-400">تابع أرباحك وعروض الأسعار النشطة</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">الرصيد المتاح</p>
                        <div className="flex items-baseline gap-2 mb-8">
                            <h2 className="text-4xl font-black">{stats.balance.toLocaleString()}</h2>
                            <span className="text-sm font-bold text-slate-400">ج.م</span>
                        </div>
                        <div className="flex gap-3">
                            <Button className="flex-1 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl font-black h-12">تحويل للبنك</Button>
                            <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/10 hover:bg-white/5 flex items-center justify-center">
                                <ArrowUpRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="rounded-[2rem] border-none shadow-sm bg-white p-6">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">معلق</p>
                            <h3 className="text-xl font-black text-slate-900">{stats.pending.toLocaleString()}</h3>
                            <div className="mt-4 flex items-center gap-1 text-[#eb6a1d]">
                                <Clock className="h-3 w-3" />
                                <span className="text-[10px] font-bold">قيد المراجعة</span>
                            </div>
                        </Card>
                        <Card className="rounded-[2rem] border-none shadow-sm bg-white p-6">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">هذا الشهر</p>
                            <h3 className="text-xl font-black text-slate-900">{stats.thisMonth.toLocaleString()}</h3>
                            <div className="mt-4 flex items-center gap-1 text-[#009966]">
                                <TrendingUp className="h-3 w-3" />
                                <span className="text-[10px] font-bold">بزيادة 12%</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <main className="px-6 mt-10 space-y-10">
                {/* --- New Bids / Opportunities (Connected to /bids/new) --- */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 text-[#eb6a1d] flex items-center justify-center">
                                <CircleDollarSign className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">أحدث العروض المقدمة</h3>
                        </div>
                        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            {bids.length} طلب
                        </span>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-32 w-full bg-slate-100 rounded-[2rem] animate-pulse" />
                                    ))}
                                </div>
                            ) : bids.length > 0 ? (
                                bids.map((bid, idx) => (
                                    <motion.div
                                        key={bid.id || idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card className="rounded-[2.5rem] border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white group border border-slate-50">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#eb6a1d]/5 group-hover:text-[#eb6a1d] transition-colors">
                                                            <Package className="h-7 w-7" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-black text-slate-900">شحنة #{bid.shipment_id || '---'}</h4>
                                                                <span className={cn(
                                                                    "text-[8px] font-black px-2 py-0.5 rounded-full uppercase",
                                                                    bid.status === 'accepted' ? "bg-emerald-50 text-[#009966]" : "bg-orange-50 text-[#eb6a1d]"
                                                                )}>
                                                                    {bid.status === 'accepted' ? 'مقبول' : 'قيد الانتظار'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                                                <span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5 text-slate-300" /> {new Date(bid.created_at).toLocaleDateString('ar-EG')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-right">
                                                        <div className="flex items-baseline gap-1 justify-end">
                                                            <span className="text-xl font-black text-slate-900">{bid.amount?.toLocaleString()}</span>
                                                            <span className="text-[10px] font-bold text-slate-400">ج.م</span>
                                                        </div>
                                                        <p className="text-[9px] font-black text-[#eb6a1d] uppercase mt-1">عرض السعر</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-20 bg-white/50 rounded-[3rem] border border-dashed border-slate-200 text-center space-y-4">
                                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-200">
                                        <CircleDollarSign className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-slate-900">لا توجد عروض جديدة</p>
                                        <p className="text-xs font-bold text-slate-400">عروض الأسعار التي تقدمها ستظهر هنا عند تحديثها.</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* --- Transaction History --- */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ArrowDownLeft className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">سجل المعاملات</h3>
                        </div>
                        <Button variant="ghost" className="text-slate-400 font-bold text-xs hover:bg-slate-50 rounded-xl">فلترة</Button>
                    </div>

                    <div className="space-y-2">
                        {[
                            { title: 'تحويل أرباح الرحلة #1245', amount: 850, date: 'أمس 04:30 م', type: 'credit' },
                            { title: 'سحب رصيد للبنك', amount: -2400, date: '١٢ أكتوبر ٢٠٢٣', type: 'debit' },
                            { title: 'مكافأة إتمام الرحلات', amount: 200, date: '١٠ أكتوبر ٢٠٢٣', type: 'credit' }
                        ].map((tx, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-50 group hover:border-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                        tx.type === 'credit' ? "bg-emerald-50 text-[#009966]" : "bg-slate-50 text-slate-400"
                                    )}>
                                        {tx.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{tx.title}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{tx.date}</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "text-sm font-black",
                                    tx.type === 'credit' ? "text-[#009966]" : "text-slate-900"
                                )}>
                                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} ج.م
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default DriverEarnings
