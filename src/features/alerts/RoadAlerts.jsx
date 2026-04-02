import { useState } from 'react'
import {
    AlertTriangle,
    MapPin,
    ShieldAlert,
    Eye,
    Plus,
    Navigation,
    Clock,
    ThumbsUp,
    MessageSquare
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export const RoadAlerts = () => {
    const [showReportModal, setShowReportModal] = useState(false)

    const alerts = [
        {
            id: 1,
            type: 'حادث',
            location: 'طريق القاهرة الإسكندرية الصحراوي - كم 45',
            time: 'منذ 5 دقائق',
            reporter: 'كابتن محمود',
            reliability: 85,
            severity: 'high'
        },
        {
            id: 2,
            type: 'أعمال طريق',
            location: 'محور 26 يوليو - اتجاه الشيخ زايد',
            time: 'منذ 15 دقيقة',
            reporter: 'كابتن ياسر',
            reliability: 92,
            severity: 'medium'
        },
        {
            id: 3,
            type: 'ازدحام شديد',
            location: 'الطريق الدائري - وصلة المريوطية',
            time: 'منذ ساعة',
            reporter: 'كابتن علي',
            reliability: 40,
            severity: 'low'
        },
    ]

    const alertTypes = [
        { id: 'accident', name: 'حادث', icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
        { id: 'cops', name: 'رادار / تفتيش', icon: ShieldAlert, color: 'bg-blue-50 text-blue-600' },
        { id: 'traffic', name: 'زحام مروري', icon: Clock, color: 'bg-amber-50 text-amber-600' },
        { id: 'works', name: 'أعمال طريق', icon: Navigation, color: 'bg-slate-50 text-slate-600' },
    ]

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">تنبيهات الطريق</h1>
                    <p className="text-slate-500 font-medium">ساهم في سلامة الجميع، أبلغ عن أي عوائق على الطريق حالاً</p>
                </div>
                <Button
                    className="rounded-full gap-2 px-8 h-12 bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200"
                    onClick={() => setShowReportModal(true)}
                >
                    <AlertTriangle className="h-5 w-5" />
                    إبلاغ عن تنبيه
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Live Filter / Map Sidebar (Mock) */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none overflow-hidden h-96 relative">
                        <div className="p-6 relative z-10">
                            <h3 className="text-lg font-black mb-1">الخريطة التفاعلية</h3>
                            <p className="text-xs opacity-50 font-bold">عرض التنبيهات في نطاق 50 كم</p>
                        </div>
                        <div className="absolute inset-0 bg-brand-primary/20 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-white animate-pulse" />
                        </div>
                    </Card>

                    <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex gap-4">
                        <Eye className="h-6 w-6 text-blue-600 shrink-0" />
                        <p className="text-xs text-blue-700 leading-relaxed font-bold">
                            تساعد التنبيهات السائقين الآخرين على تجنب التأخير والحفاظ على سلامة البضائع.
                        </p>
                    </div>
                </div>

                {/* Alerts List */}
                <div className="lg:col-span-2 space-y-4">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className="group hover:-translate-y-1 transition-all">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                            alert.severity === 'high' ? "bg-red-50 text-red-600" :
                                                alert.severity === 'medium' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                        )}>
                                            <AlertTriangle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg text-slate-900">{alert.type}</h4>
                                            <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {alert.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{alert.time}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
                                            <ThumbsUp className="h-3.5 w-3.5" />
                                            <span>{alert.reliability}% موثوقية</span>
                                        </div>
                                        <p className="text-xs font-bold text-brand-primary">بواسطة: {alert.reporter}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="gap-2 text-slate-400">
                                            <MessageSquare className="h-4 w-4" />
                                            تأكيد
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
                    <Card className="w-full max-w-lg relative z-10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">بماذا تريد الإبلاغ؟</h3>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {alertTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        className={cn(
                                            "p-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 border-transparent hover:border-brand-primary/20 active:scale-95",
                                            type.color
                                        )}
                                    >
                                        <type.icon className="h-8 w-8" />
                                        <span className="font-black text-sm">{type.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700">الموقع الحالي (تلقائي)</label>
                                    <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="h-5 w-5 text-brand-primary" />
                                            <span className="text-sm font-bold text-slate-600">طريق مصر الإسكندرية الصحراوي</span>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 uppercase">دقيق جداً</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black" onClick={() => setShowReportModal(false)}>إلغاء</Button>
                                    <Button className="flex-2 h-14 rounded-2xl font-black bg-red-600 hover:bg-red-700 shadow-xl shadow-red-100" onClick={() => setShowReportModal(false)}>إرسال التنبيه الآن</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
