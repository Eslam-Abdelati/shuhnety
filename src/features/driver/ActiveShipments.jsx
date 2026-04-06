import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Package,
    MapPin,
    Clock,
    ChevronLeft,
    CheckCircle2,
    Truck,
    Box,
    Loader2,
    Calendar,
    ArrowLeftRight,
    TrendingUp,
    Navigation,
    Weight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { shipmentService } from '@/services/shipmentService'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'react-hot-toast'
import { getGoodsTypeLabel, getStatusStyles } from '@/utils/shipmentUtils'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export const ActiveShipments = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchActiveShipments = async () => {
        setLoading(true)
        try {
            const response = await shipmentService.getAssignedShipments({ skip: 0, take: 50 })
            const data = response.data?.shipments || (Array.isArray(response.data) ? response.data : [])
            setShipments(data)
        } catch (error) {
            console.error('Failed to fetch assigned shipments:', error)
            toast.error('تعذر تحميل الرحلات النشطة')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActiveShipments()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">جاري تحميل رحلاتك...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col gap-1 items-start mb-8 font-cairo">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">سجل الرحلات النشطة</h1>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {shipments.length} رحلة إجمالاً
                </div>
            </div>

            {/* Shipments List */}
            <div className="space-y-4 font-cairo">
                {shipments.length > 0 ? (
                    shipments.map((s) => {
                        const statusStyle = getStatusStyles(s.status)

                        return (
                            <div
                                key={s.id}
                                onClick={() => navigate(`/driver/available/${s.id}`)}
                                className="rounded-[2.5rem] border border-slate-200/60 bg-white text-card-foreground shadow-[0_20px_50px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] duration-500 group transition-all overflow-hidden cursor-pointer"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center text-white transition-colors",
                                                statusStyle.bg.replace('bg-', 'bg-').includes('emerald') ? 'bg-emerald-500' : 'bg-brand-primary'
                                            )}>
                                                <Truck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-black text-slate-900">
                                                        {getGoodsTypeLabel(s.goodsType)}
                                                    </h4>
                                                    <div className={cn(
                                                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border",
                                                        statusStyle.bg,
                                                        statusStyle.text,
                                                        statusStyle.border
                                                    )}>
                                                        {s.status}
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    {s.displayId}
                                                    {/* {s.createdAt ? format(new Date(s.createdAt), 'dd MMMM yyyy', { locale: ar }) : '---'} */}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">التكلفة</p>
                                            <p className="text-sm font-black text-brand-primary whitespace-nowrap">
                                                {s.bids?.[0]?.amount || s.price || '---'} EGP
                                            </p>
                                        </div>
                                    </div>

                                    {/* Path Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-slate-50/50 p-4 rounded-3xl border border-slate-50 relative">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase">نقطة التحميل</p>
                                            </div>
                                            <p className="text-xs font-bold text-slate-700">{s.pickupGovernorate}، {s.pickupCity}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase">نقطة التوصيل</p>
                                            </div>
                                            <p className="text-xs font-bold text-slate-700">{s.destinationGovernorate}، {s.destinationCity}</p>
                                        </div>
                                    </div>

                                    {/* Footer Details */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                                <Weight className="h-3 w-3 text-slate-400" />
                                                <span>{s.weight} كجم</span>
                                            </div>

                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs font-black text-slate-400 group-hover:text-brand-primary gap-1">
                                            التفاصيل
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Truck className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">لا يوجد سجل رحلات</h3>
                        <p className="text-slate-400 font-bold max-w-xs text-center">لم تقم بأي رحلات حتى الآن. ابدأ بالمزايدة على الشحنات المتاحة.</p>
                        <Button
                            onClick={() => navigate('/driver/available')}
                            className="mt-8 bg-brand-primary rounded-xl font-black"
                        >
                            تصفح الشحنات المتاحة
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}