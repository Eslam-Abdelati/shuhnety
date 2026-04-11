import { useState } from 'react'
import {
    ShieldAlert,
    Search,
    Filter,
    MoreVertical,
    Scale,
    MessageCircle,
    ChevronLeft,
    Info,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export const DisputeResolution = () => {
    const [selectedDispute, setSelectedDispute] = useState(null)

    const disputes = [
        {
            id: 'DIS-101',
            shipment: 'SH-2024-501',
            status: 'معلق',
            requester: 'متجر الصفوة (عميل)',
            against: 'أحمد كمال (كابتن)',
            type: 'تأخير في التوصيل',
            time: 'منذ ساعتين'
        },
        {
            id: 'DIS-102',
            shipment: 'SH-2024-505',
            status: 'قيد المراجعة',
            requester: 'محمود علي (كابتن)',
            against: 'سوبر ماركت الهدى (عميل)',
            type: 'خلاف على السعر',
            time: 'منذ 5 ساعات'
        },
        {
            id: 'DIS-103',
            shipment: 'SH-2024-610',
            status: 'حرج',
            requester: 'شركة النور (عميل)',
            against: 'مصطفى سيد (كابتن)',
            type: 'تلف في البضائع',
            time: 'أمس'
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">مركز حل النزاعات</h1>
                    <p className="text-slate-500 font-medium font-cairo">إدارة الخلافات بين العملاء والكباتن وضمان الحقوق</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl gap-2 h-12">
                        <Filter className="h-5 w-5" />
                        تصفية
                    </Button>
                    <Button className="rounded-xl gap-2 h-12 bg-slate-900 text-white shadow-xl shadow-slate-200">
                        <Scale className="h-5 w-5" />
                        تقارير النزاعات
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Disputes Feed */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-black text-slate-900">النزاعات النشطة</h3>
                        <span className="text-xs font-black text-brand-primary">{disputes.length} نزاعات</span>
                    </div>

                    {disputes.map((dis) => (
                        <Card
                            key={dis.id}
                            className={cn(
                                "group cursor-pointer transition-all duration-300",
                                selectedDispute === dis.id ? "ring-2 ring-brand-primary shadow-xl" : "hover:shadow-md"
                            )}
                            onClick={() => setSelectedDispute(dis.id)}
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                            dis.status === 'حرج' ? "bg-red-50 text-red-600" :
                                                dis.status === 'معلق' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            <ShieldAlert className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg text-slate-900">{dis.type}</h4>
                                            <p className="text-xs text-slate-500 font-bold">الشحنة: {dis.shipment} • {dis.id}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dis.time}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-6 py-4 border-y border-slate-50">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المدعي</p>
                                        <p className="text-sm font-bold text-slate-800">{dis.requester}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المدعى عليه</p>
                                        <p className="text-sm font-bold text-slate-800">{dis.against}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={cn(
                                        "text-[10px] px-2.5 py-1 rounded-lg font-black uppercase",
                                        dis.status === 'حرج' ? "bg-red-50 text-red-600" :
                                            dis.status === 'معلق' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                    )}>
                                        {dis.status}
                                    </span>
                                    <Button variant="ghost" size="sm" className="gap-2 font-black transition-all group-hover:bg-slate-50">
                                        مراجعة التفاصيل
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Resolution Panel / Info */}
                <div className="space-y-6">
                    <Card className="sticky top-28 overflow-hidden border-none shadow-2xl bg-white ring-1 ring-slate-100">
                        {selectedDispute ? (
                            <CardContent className="p-8">
                                <div className="text-center mb-8">
                                    <div className="h-16 w-16 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Scale className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">اتخاذ إجراء</h3>
                                    <p className="text-sm text-slate-500 font-medium">مراجعة الأدلة والشهادات لحل النزاع رقم {selectedDispute}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">تواصل سريع</h5>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-black bg-white">اتصال بالعميل</Button>
                                            <Button variant="outline" className="flex-1 rounded-xl h-10 text-xs font-black bg-white">اتصال بالكابتن</Button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">القرار النهائي</h5>
                                        <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                <span className="text-sm font-bold text-slate-700">حل لصالح العميل</span>
                                            </div>
                                        </button>
                                        <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                                                <span className="text-sm font-bold text-slate-700">حل لصالح الكابتن</span>
                                            </div>
                                        </button>
                                        <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <XCircle className="h-5 w-5 text-red-500" />
                                                <span className="text-sm font-bold text-slate-700">تصعيد إلى الإدارة العليا</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        ) : (
                            <div className="p-10 text-center space-y-6">
                                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                    <Info className="h-12 w-12" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-400">اختر نزاعاً للمراجعة</h4>
                                    <p className="text-sm text-slate-300 font-medium">سيتم عرض أدلة النزاع والدردشات السابقة هنا</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

