import { useState, useEffect } from 'react'
import {
    Wallet,
    Briefcase,
    TrendingUp,
    Calendar,
    BarChart3,
    RefreshCcw,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { shipmentService } from '@/services/shipmentService'

import { Loading } from '@/components/ui/Loading'

export const DriverReports = () => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState(null)
    const [error, setError] = useState(null)

    const fetchStats = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await shipmentService.getBidDashboardStats()
            setStats(result?.data || result)
        } catch (err) {
            console.error('Reports Fetch Error:', err)
            setError('تعذر تحميل إحصائيات الأداء حالياً.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    if (loading) {
        return <Loading text="جاري تحليل البيانات المالية وتجهيز التقارير..." />
    }

    const reportItems = [
        { title: 'أداء اليوم', data: stats?.daily, color: 'orange', icon: <TrendingUp className="h-5 w-5" /> },
        { title: 'أداء الشهر', data: stats?.monthly, color: 'emerald', icon: <Calendar className="h-5 w-5" /> },
        { title: 'أداء السنة', data: stats?.yearly, color: 'blue', icon: <BarChart3 className="h-5 w-5" /> },
        { title: 'الإجمالي الكلي', data: stats?.total, color: 'slate', icon: <Wallet className="h-5 w-5" /> }
    ]

    return (
        <div className="space-y-8 pb-20" dir="rtl">
            {/* Simple Header Inside Layout */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">التقارير المالية</h1>
                    <p className="text-xs font-bold text-slate-400 mt-1">نظرة عامة على نشاطك وأرباحك المباشرة</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="h-10 w-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 shadow-sm flex items-center justify-center transition-all active:scale-90"
                    title="تحديث البيانات"
                >
                    <RefreshCcw className="h-4 w-4" />
                </button>
            </div>

            {/* Error handling - clean and small */}
            {error && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-700 text-xs font-bold">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportItems.map((item, idx) => (
                    <Card key={idx} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white hover:shadow-md transition-all">
                        <div className={`p-5 flex items-center justify-between text-white ${item.color === 'orange' ? 'bg-[#eb6a1d]' :
                                item.color === 'emerald' ? 'bg-[#009966]' :
                                    item.color === 'blue' ? 'bg-blue-600' : 'bg-slate-900'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <h3 className="font-black text-lg">{item.title}</h3>
                            </div>
                            <span className="text-[9px] font-black bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">مباشر</span>
                        </div>
                        <CardContent className="p-7">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">الأرباح</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900">{(item.data?.earnings || 0).toLocaleString()}</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">ج.م</span>
                                    </div>
                                </div>
                                <div className="border-r border-slate-50 pr-6">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">الرحلات</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900">{item.data?.trips || 0}</span>
                                        <Briefcase className="h-4 w-4 text-slate-300" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Summary Insight */}
            <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between shadow-xl">
                <div className="space-y-0.5">
                    <h4 className="font-black text-sm text-slate-400">تحليل العائد</h4>
                    <p className="text-lg font-black text-white">متوسط الرحلة: <span className="text-[#009966]">{(stats?.total?.earnings / (stats?.total?.trips || 1)).toFixed(0)} ج.م</span></p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
            </div>
        </div>
    )
}

export default DriverReports

