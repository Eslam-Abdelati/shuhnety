import { useState, useEffect } from 'react'
import {
    AlertTriangle,
    MapPin,
    ShieldAlert,
    Eye,
    Plus,
    Navigation,
    Clock,
    ThumbsUp,
    MessageSquare,
    Wind
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { roadAlertService } from '@/services/roadAlertService'
import { toast } from 'react-hot-toast'

export const RoadAlerts = () => {
    const [showReportModal, setShowReportModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedType, setSelectedType] = useState(null)
    const [locationText, setLocationText] = useState('')
    const [activeAlerts, setActiveAlerts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchActiveAlerts = async () => {
        setIsLoading(true);
        try {
            const response = await roadAlertService.getActiveAlerts();
            console.log('Road Alerts Data Structure:', response);
            // Assuming the data is in response.data or response
            const alertsList = response.data || response;
            setActiveAlerts(Array.isArray(alertsList) ? alertsList : []);
        } catch (error) {
            console.error('Failed to fetch road alerts:', error);
            // toast.error('فشل في تحديث قائمة التنبيهات');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveAlerts();
    }, []);

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
        { id: 'sand_dunes', name: 'زحف رمال', icon: Wind, color: 'bg-orange-50 text-orange-600' },
    ]

    const handleSubmitAlert = async () => {
        if (!selectedType) {
            toast.error('يرجى اختيار نوع التنبيه');
            return;
        }

        setIsSubmitting(true);
        try {
            await roadAlertService.createRoadAlert({
                type: selectedType,
                locationText: locationText
            });
            toast.success('تم إرسال التنبيه بنجاح، شكراً لمساهمتك');
            setShowReportModal(false);
            setSelectedType(null);
        } catch (error) {
            toast.error(error.message || 'فشل في إرسال التنبيه');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-slate-900 mb-0">تنبيهات الطريق</h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full h-10 w-10 p-0 text-slate-400 hover:text-brand-primary"
                        onClick={fetchActiveAlerts}
                        disabled={isLoading}
                    >
                        <Clock className={cn("h-5 w-5", isLoading && "animate-spin")} />
                    </Button>
                </div>
                <Button
                    className="rounded-2xl gap-2 px-8 h-12 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100 border-none transition-all active:scale-95 hover:scale-[1.02]"
                    onClick={() => setShowReportModal(true)}
                >
                    <Plus className="h-5 w-5" />
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
                            تساعد التنبيهات الكباتن الآخرين على تجنب التأخير والحفاظ على سلامة الجميع والبضائع.
                        </p>
                    </div>
                </div>

                {/* Alerts List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="p-12 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 animate-pulse">
                            <Clock className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">جاري تحميل التنبيهات النشطة...</p>
                        </div>
                    ) : (activeAlerts.length > 0 ? activeAlerts : alerts).map((alert, idx) => {
                        const typeInfo = alertTypes.find(t => t.id === alert.type) || { name: alert.type || 'تنبيه', icon: AlertTriangle, color: 'bg-slate-50 text-slate-600' };

                        return (
                            <Card key={alert.id || idx} className="group hover:-translate-y-1 transition-all">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                                typeInfo.color
                                            )}>
                                                <typeInfo.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg text-slate-900">{typeInfo.name}</h4>
                                                <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {alert.locationText || alert.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString('ar-EG') : (alert.time || 'الآن')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl">
                                                <ThumbsUp className="h-3.5 w-3.5" />
                                                <span>{alert.reliability || 100}% موثوقية</span>
                                            </div>
                                            <p className="text-xs font-bold text-brand-primary">بواسطة: {alert.reporter || 'نظام شحنتي'}</p>
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
                        );
                    })}
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
                                        onClick={() => setSelectedType(type.id)}
                                        className={cn(
                                            "p-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 active:scale-95",
                                            selectedType === type.id
                                                ? "border-brand-primary bg-brand-primary/5 ring-4 ring-brand-primary/10"
                                                : "border-transparent " + type.color
                                        )}
                                    >
                                        <type.icon className="h-8 w-8" />
                                        <span className="font-black text-sm">{type.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-700 mb-3 block">الموقع الحالي</label>
                                    <input
                                        type="text"
                                        value={locationText}
                                        onChange={(e) => setLocationText(e.target.value)}
                                        className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        placeholder="مثال: طريق القاهرة الإسكندرية الصحراوي - كم 45"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black" onClick={() => setShowReportModal(false)}>إلغاء</Button>
                                    <Button
                                        className="flex-2 h-14 rounded-2xl font-black bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-50 transition-all hover:scale-[1.01]"
                                        onClick={handleSubmitAlert}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال التنبيه الآن'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

