import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Package,
    MapPin,
    Clock,
    ChevronLeft,
    CheckCircle2,
    Weight,
    Box,
    Loader2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { shipmentService } from '@/services/shipmentService'
import { useAuthStore } from '@/store/useAuthStore'
import { useOfferStore } from '@/store/useOfferStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { getGoodsTypeLabel } from '@/utils/shipmentUtils'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

export const AvailableShipments = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { offers, addOffer } = useOfferStore()
    const { addNotification } = useNotificationStore()
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchShipments = async () => {
            setLoading(true)
            try {
                const response = await shipmentService.searchAvailableShipments({ skip: 0, take: 50 })
                const data = response.data?.shipments || (Array.isArray(response.data) ? response.data : [])


                setShipments(data)
            } catch (error) {
                console.error('Failed to fetch shipments:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchShipments()
    }, [])

    const hasBid = (s) => {
        // Check API response bids
        if (s.bids && s.bids.length > 0) return true;
        // Check local store offers (for newly submitted bids)
        return (offers || []).some(o => String(o.shipmentId) === String(s.id) && String(o.driverId) === String(user?.id || 'doc-driver-id'))
    }

    const getOfferPrice = (s) => {
        // Check API response bids first
        if (s.bids && s.bids.length > 0) {
            return s.bids[0].amount;
        }
        // Check local store
        const offer = (offers || []).find(o => String(o.shipmentId) === String(s.id) && String(o.driverId) === String(user?.id || 'doc-driver-id'))
        return offer ? offer.price : null
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">جاري تحميل الشحنات المتاحة...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col gap-1 items-start mb-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">شحنات متاحة للمزايدة</h1>
                <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ">
                    {shipments.length} شحنة متاحة الآن
                </div>
            </div>

            {/* Shipments List */}
            <div className="space-y-4">
                {shipments.length > 0 ? (
                    shipments.map((s) => {
                        const submitted = hasBid(s)
                        const bidPrice = getOfferPrice(s)

                        return (
                            <div
                                key={s.id}
                                className="rounded-[2.5rem] border border-slate-200/60 bg-white text-card-foreground shadow-[0_20px_50px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] duration-500 group hover:ring-2 hover:ring-brand-primary transition-all overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 group-hover:text-brand-primary transition-colors flex items-center gap-3 flex-wrap">
                                                    <span>{getGoodsTypeLabel(s.goodsType)}</span>

                                                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                        <span>وزن {s.weight || s.total_weight || '--'}</span>
                                                        <span className="opacity-30">•</span>
                                                        <span>طول {s.length || '--'}</span>
                                                        <span className="opacity-30">•</span>
                                                        <span>عرض {s.width || '--'}</span>
                                                        <span className="opacity-30">•</span>
                                                        <span>ارتفاع {s.height || '--'}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 px-3 py-1 bg-slate-50/50 rounded-full border border-slate-100">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 animate-pulse"></div>
                                                        <span>{s.pickupGovernorate}</span>
                                                        <ChevronLeft className="h-3 w-3 opacity-20" />
                                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-red-100"></div>
                                                        <span>{s.destinationGovernorate}</span>
                                                    </div>
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                    {s.displayId} • {s.createdAt ? formatDistanceToNow(new Date(s.createdAt), { locale: ar, addSuffix: true }) : 'منذ قليل'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Details Link */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/driver/available/${s.id}`);
                                            }}
                                            className="text-xs font-black text-slate-400 hover:text-brand-primary cursor-pointer transition-all"
                                        >
                                            تفاصيل
                                        </button>
                                    </div>



                                    {/* Description and Price */}
                                    <div className="space-y-4 mb-6">
                                        {/* Description Box
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">وصف الشحنة</p>
                                            <p className="text-xs font-bold text-slate-600 leading-relaxed line-clamp-2">
                                                {s.description || s.notes || 'لا يوجد وصف متاح'}
                                            </p>
                                        </div> */}

                                        {/* Price Display */}
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">
                                                {submitted ? 'عرضك المقدم' : 'السعر المتوقع'}
                                            </span>
                                            <span className="text-lg font-black text-brand-primary">
                                                {submitted ? `${bidPrice} EGP` : 'قيد التفاوض'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {submitted ? (
                                        <div className="w-full h-12 rounded-xl flex items-center justify-center gap-2 bg-amber-50 text-amber-600 border border-amber-100 font-black text-sm">
                                            <CheckCircle2 className="h-5 w-5" />
                                            تم تقديم عرضك
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => navigate(`/driver/available/${s.id}`)}
                                            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 bg-brand-primary text-white font-black text-sm shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                        >
                                            تقديم عرض سعر
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Package className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">لا توجد شحنات متاحة</h3>
                        <p className="text-slate-400 font-bold max-w-xs text-center">انتظر قليلاً حتى تظهر شحنات جديدة تتناسب مع مسارك.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
