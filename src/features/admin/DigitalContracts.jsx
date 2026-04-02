import { useState } from 'react'
import {
    FileText,
    PenTool,
    Search,
    Filter,
    Plus,
    Download,
    Share2,
    ShieldCheck,
    CheckCircle2,
    Clock,
    MoreVertical
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export const DigitalContracts = () => {
    const contracts = [
        {
            id: 'CRT-5001',
            title: 'اتفاقية نقل معدات طبية',
            partyA: 'مستشفى الشروق',
            partyB: 'شركة السلام للنقل',
            date: '2024-02-14',
            status: 'موقّع',
            value: '15,000 EGP'
        },
        {
            id: 'CRT-5002',
            title: 'عقد نقل مواد بناء (خام)',
            partyA: 'متجر الصفوة للاسمنت',
            partyB: 'كابتن محمود علي',
            date: '2024-02-15',
            status: 'قيد التوقيع',
            value: '8,500 EGP'
        },
        {
            id: 'CRT-5003',
            title: 'تجديد ترقية حساب شركة',
            partyA: 'منصة شحنتي',
            partyB: 'لوجستيك العرب',
            date: '2024-02-10',
            status: 'موقّع',
            value: '2,400 EGP'
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">العقود الرقمية</h1>
                    <p className="text-slate-500 font-medium font-cairo">التوثيق القانوني لعمليات الشحن والتعاقدات الرسمية</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl gap-2 h-12">
                        <Filter className="h-5 w-5" />
                        تصفية
                    </Button>
                    <Button className="rounded-xl gap-2 h-12 bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700">
                        <Plus className="h-5 w-5" />
                        إنشاء مسودة عقد
                    </Button>
                </div>
            </div>

            {/* Contract Builder Card (Mock) */}
            <Card className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <CardContent className="p-10 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl text-center lg:text-right">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-4">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                تقنية التوقيع المشفر
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 leading-tight">بناء عقود ذكية وموثقة في ثوانٍ</h2>
                            <p className="text-indigo-200/60 font-medium leading-relaxed">
                                استخدم القوالب القانونية المعدة مسبقاً لضمان حقوق كافة الأطراف. العقود الرقمية في شحنتي معترف بها قانونياً وتستخدم التشفير لضمان عدم التلاعب.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                                <Button className="rounded-full px-8 bg-white text-indigo-900 font-black hover:bg-indigo-50 shadow-xl">ابدأ الآن</Button>
                                <Button variant="ghost" className="text-white hover:bg-white/5 px-8 font-bold">عرض القوالب</Button>
                            </div>
                        </div>
                        <div className="hidden lg:block w-80 h-96 bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/10 p-8 rotate-3 shadow-2xl scale-105">
                            <div className="h-4 w-3/4 bg-white/20 rounded mb-6"></div>
                            <div className="h-4 w-1/2 bg-white/10 rounded mb-12"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-2 w-full bg-white/5 rounded"></div>)}
                            </div>
                            <div className="mt-20 flex justify-between items-end">
                                <div className="space-y-2">
                                    <div className="h-8 w-24 bg-indigo-500/40 rounded-lg"></div>
                                    <div className="h-2 w-16 bg-white/10 rounded"></div>
                                </div>
                                <PenTool className="h-10 w-10 text-indigo-400 opacity-50" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-slate-900">سجل العقود</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="بحث في العقود والاتفاقيات..."
                            className="w-full bg-slate-50 border-none rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all font-cairo"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-6 py-4">رقم العقد</th>
                                <th className="px-6 py-4">العنوان</th>
                                <th className="px-6 py-4">الأطراف المتعاقدة</th>
                                <th className="px-6 py-4">التاريخ</th>
                                <th className="px-6 py-4">القيمة</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {contracts.map((crt) => (
                                <tr key={crt.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-black text-indigo-600">{crt.id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">{crt.title}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-slate-700">{crt.partyA}</span>
                                            <span className="text-[10px] text-slate-400">ضد {crt.partyB}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{crt.date}</td>
                                    <td className="px-6 py-4 font-black text-sm text-slate-900">{crt.value}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase",
                                            crt.status === 'موقّع' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {crt.status === 'موقّع' ? <CheckCircle2 className="h-3 w-3 ml-1" /> : <Clock className="h-3 w-3 ml-1" />}
                                            {crt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600"><Download className="h-4 w-4" /></button>
                                            <button className="p-2 text-slate-400 hover:text-indigo-600"><Share2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
