import {
    BarChart3,
    Wallet,
    ShieldCheck,
    TrendingUp,
    FileText,
    Download,
    Filter,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export const GovDashboard = () => {
    const stats = [
        { label: 'إجمالي الرسوم المحصلة', value: '450,000', icon: Wallet, color: 'emerald', trend: '+12%' },
        { label: 'رسوم قيد التحقق', value: '12,450', icon: Clock, color: 'amber', trend: '85 إيصال' },
        { label: 'شحنات نشطة حالياً', value: '1,245', icon: BarChart3, color: 'blue', trend: '+5%' },
        { label: 'رسوم غير مدفوعة', value: '3,200', icon: XCircle, color: 'red', trend: '-2%' },
    ]

    const queue = [
        { id: 'SH-2024-501', driver: 'أحمد كمال', amount: '150 EGP', time: 'منذ 5 دقائق', provider: 'فوري' },
        { id: 'SH-2024-502', driver: 'محمود علي', amount: '220 EGP', time: 'منذ 12 دقيقة', provider: 'فيزا' },
        { id: 'SH-2024-503', driver: 'سيد إبراهيم', amount: '85 EGP', time: 'منذ 20 دقيقة', provider: 'محفظة إلكترونية' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">لوحة تحكم المحافظة</h1>
                    <p className="text-slate-500 font-medium font-cairo">مراقبة التحصيل المالي والحركة اللوجستية في نطاقك</p>
                </div>
                <Button className="rounded-xl gap-2 h-12 shadow-xl shadow-brand-primary/20">
                    <Download className="h-5 w-5" />
                    تصدير التقرير المالي
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <Card key={i} className="hover:-translate-y-1 transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                    s.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                                        s.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                            s.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                                )}>
                                    <s.icon className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.trend}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500">{s.label}</p>
                            <h4 className="text-3xl font-black text-slate-900 mt-1">{s.value} <span className="text-sm font-bold opacity-30">EGP</span></h4>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Verification Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900">طابور التحقق من الإيصالات</h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm">عرض الكل</Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="px-6 py-4">رقم الشحنة</th>
                                        <th className="px-6 py-4">السائق</th>
                                        <th className="px-6 py-4">المبلغ</th>
                                        <th className="px-6 py-4">وسيلة الدفع</th>
                                        <th className="px-6 py-4">التوقيت</th>
                                        <th className="px-6 py-4">الإجراء</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {queue.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-sm text-brand-primary">{item.id}</td>
                                            <td className="px-6 py-4 font-bold text-sm text-slate-700">{item.driver}</td>
                                            <td className="px-6 py-4 font-black text-sm text-slate-900">{item.amount}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{item.provider}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-400">{item.time}</td>
                                            <td className="px-6 py-4 flex gap-2 justify-end">
                                                <button className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                                <button className="h-8 w-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Analytics Summary */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-brand-primary to-slate-800 text-white border-none shadow-xl">
                        <CardContent className="p-8">
                            <h4 className="text-lg font-black mb-6">توقعات التحصيل</h4>
                            <div className="space-y-6">
                                {[
                                    { label: 'الأسبوع القادم', value: '85,000 EGP', progress: 85 },
                                    { label: 'الشهر القادم', value: '340,000 EGP', progress: 45 },
                                    { label: 'الربع السنوي', value: '1,200,000 EGP', progress: 20 },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="opacity-60">{item.label}</span>
                                            <span>{item.value}</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-secondary rounded-full" style={{ width: `${item.progress}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-8 border-white/20 text-white hover:bg-white/10 rounded-xl">
                                فتح التحليلات المتقدمة
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
