import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Package,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Clock,
    Weight,
    Calculator,
    ShieldCheck,
    CreditCard,
    AlertCircle,
    Loader2,
    Ruler,
    Maximize,
    ChevronDown,
    Info,
    Calendar,
    ArrowLeft,
    ArrowRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { shipmentService } from '@/services/shipmentService'
import { useAuthStore } from '@/store/useAuthStore'
import { useOfferStore } from '@/store/useOfferStore'
import { toast } from 'react-hot-toast'
import { getGoodsTypeLabel } from '@/utils/shipmentUtils'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

export const SubmitOfferPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { offers, addOffer } = useOfferStore()

    const [shipment, setShipment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // Form state
    const [price, setPrice] = useState('')
    const [expectedTime, setExpectedTime] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true)
            try {
                const data = await shipmentService.getShipmentById(id)
                setShipment(data)
            } catch (err) {
                console.error('Failed to fetch shipment:', err)
                setError('تعذر تحميل تفاصيل الشحنة. يرجى المحاولة مرة أخرى.')
            } finally {
                setLoading(false)
            }
        }
        fetchDetails()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!price || isNaN(price) || Number(price) <= 0) {
            toast.error('برجاء إدخال مبلغ عرض صحيح');
            return
        }

        if (!expectedTime.trim() || isNaN(expectedTime) || Number(expectedTime) < 10) {
            toast.error('برجاء إدخال موعد وصول صحيح (يجب ألا يقل عن 10 ساعات)');
            return
        }

        setSubmitting(true)
        try {
            const bidData = {
                shipmentId: Number(id),
                amount: Number(price),
                estimatedTime: Number(expectedTime) * 60,
                note: notes || null
            }

            await shipmentService.submitBid(bidData)

            // Success feedback
            toast.success('تم تقديم عرضك بنجاح ونحن في انتظار رد العميل');
            
            // Also update local store for UI feedback
            addOffer({
                id: Math.random().toString(36).substr(2, 9),
                shipmentId: id,
                driverId: user?.id,
                driverName: user?.full_name || 'كابتن',
                price: Number(price),
                expectedTime: Number(expectedTime),
                notes,
                status: 'pending',
                createdAt: new Date().toISOString(),
                shipmentDetails: shipment
            })

            navigate('/driver/available')
        } catch (err) {
            console.error('Failed to submit offer:', err)
            
            // Translate specific backend validation error
            let finalMessage = err.message;
            if (finalMessage.includes('estimatedTime must not be less than 10')) {
                finalMessage = 'موعد الوصول المتوقع يجب ألا يقل عن 10 ساعات حسب قوانين المنصة';
            }

            toast.error(finalMessage || 'فشل تقديم العرض. يرجى المحاولة مرة أخرى.');
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">جاري تحميل تفاصيل الشحنة...</p>
            </div>
        )
    }

    if (error || !shipment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 text-center max-w-md mx-auto px-6">
                <div className="h-20 w-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">حدث خطأ ما</h3>
                <p className="text-slate-500 font-bold mb-8">{error || 'لم نتمكن من العثور على هذه الشحنة'}</p>
                <Button
                    onClick={() => navigate('/driver/available')}
                    className="w-full bg-slate-900 hover:bg-slate-800 h-14 rounded-2xl font-black text-lg gap-3"
                >
                    <ArrowRight className="h-5 w-5" />
                    العودة للشحنات المتاحة
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pb-24 font-cairo" dir="rtl">
            {/* Header matches AvailableShipments */}
            <div className="flex items-center justify-between mb-8 pt-4">
                <div className="flex items-center gap-4">

                    <div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">تقديم عرض سعر</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {shipment.displayId} • {shipment.createdAt ? formatDistanceToNow(new Date(shipment.createdAt), { locale: ar, addSuffix: true }) : 'منذ قليل'}
                        </p>
                    </div>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    منصة موثقة
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.04)] overflow-hidden">
                        <div className="p-6 md:p-10">
                            {/* Card Header Style matches AvailableShipments list */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 leading-none mb-1">
                                        {getGoodsTypeLabel(shipment.goodsType)}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">تفاصيل الشحنة والمسار</p>
                                </div>
                            </div>

                            {/* Shipment Description Box - New */}
                            {shipment.description && (
                                <div className="mb-8 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                                        <Info className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">توصيف شحنة العميل</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 leading-relaxed">{shipment.description}</p>
                                </div>
                            )}

                            {/* Route Tracker - Scaled to match AvailableShipments style */}
                            <div className="relative mb-10 bg-slate-50/30 p-8 rounded-[2rem] border border-slate-50">
                                <div className="space-y-8 relative before:absolute before:right-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 before:border-dashed before:border-r">
                                    <div className="relative flex items-start gap-5 mr-0.5">
                                        <div className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm z-10 mt-1"></div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase mb-1 leading-none">نقطة الاستلام</p>
                                            <p className="text-sm font-bold text-slate-800 leading-none mb-1.5">
                                                {shipment.pickupGovernorate}، {shipment.pickupCity}
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-medium">{shipment.pickupAddress}</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-start gap-5 mr-0.5">
                                        <div className="h-3 w-3 rounded-full bg-red-500 ring-4 ring-white shadow-sm z-10 mt-1"></div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase mb-1 leading-none">نقطة الوصول</p>
                                            <p className="text-sm font-bold text-slate-800 leading-none mb-1.5">
                                                {shipment.destinationGovernorate}، {shipment.destinationCity}
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-medium">{shipment.destinationAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid matches AvailableShipments font sizes */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                {[
                                    { label: 'الوزن', value: `${shipment.weight} كجم`, icon: Weight },
                                    { label: 'الطول', value: `${shipment.length || '--'} سم`, icon: Ruler },
                                    { label: 'العرض', value: `${shipment.width || '--'} سم`, icon: Maximize },
                                    { label: 'الارتفاع', value: `${shipment.height || '--'} سم`, icon: Ruler, rotate: true }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                        <span className="text-[10px] font-black uppercase text-slate-400 mb-1">{item.label}</span>
                                        <span className="text-sm font-black text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-slate-50 mb-10"></div>

                            {/* Form Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-1 w-8 bg-brand-primary rounded-full"></div>
                                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">بيانات العرض الخاص بك</h5>
                                </div>

                                <form id="offer-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">السعر المقترح (EGP)</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-brand-primary transition-colors">
                                                    <CreditCard className="h-5 w-5" />
                                                </div>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full h-14 pr-11 pl-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-primary outline-none transition-all text-lg font-black placeholder:text-slate-200"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">الوقت المتوقع للتسليم (بعدد الساعات)</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-brand-primary transition-colors">
                                                    <Clock className="h-5 w-5" />
                                                </div>
                                                <input
                                                    type="number"
                                                    value={expectedTime}
                                                    onChange={(e) => setExpectedTime(e.target.value)}
                                                    placeholder="مثال: 48"
                                                    className="w-full h-14 pr-11 pl-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-primary outline-none transition-all font-black text-lg placeholder:text-slate-200"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">ملاحظات العرض</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="أضف أي ملاحظات إضافية للعميل..."
                                            className="w-full h-[142px] px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-sm resize-none placeholder:text-slate-200"
                                        />
                                    </div>
                                </form>

                                <button
                                    form="offer-form"
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-14 bg-brand-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {submitting ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            تأكيد تقديم العرض
                                            <ChevronLeft className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
