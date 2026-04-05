import { useState, useEffect } from 'react'
import {
    Clock,
    Truck,
    MapPin,
    ArrowLeftRight,
    Search,
    Loader2,
    Package,
    TrendingUp,
    ChevronLeft,
    CheckCircle,
    User
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { shipmentService } from '@/services/shipmentService'
import { getGoodsTypeLabel, getStatusStyles, formatEstimatedTime } from '@/utils/shipmentUtils'
import { cn } from '@/lib/utils'

export const IncomingOffersPage = () => {
    const [offers, setOffers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const fetchOffers = async () => {
        setIsLoading(true)
        try {
            const data = await shipmentService.getNewBids()
            setOffers(Array.isArray(data) ? data : (data.data || []))
        } catch (err) {
            setError('فشل في تحميل العروض الجديدة')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOffers()
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-500 font-black">جاري تحميل قائمة العروض الواردة...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 font-cairo" dir="rtl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-brand-primary/10 rounded-[1.5rem] flex items-center justify-center text-brand-primary border border-brand-primary/20">
                        <TrendingUp className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">العروض الواردة</h1>
                        <p className="text-sm font-bold text-slate-500 mt-1">إليك أحدث العروض المقدمة من السائقين على شحناتك النشطة</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={fetchOffers}
                        variant="ghost"
                        className="h-11 rounded-xl font-black text-slate-600 dark:text-slate-400 group"
                    >
                        <Clock className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                        تحديث القائمة
                    </Button>
                </div>
            </div>

            {/* Offers Grid/List */}
            <div className="space-y-6">
                {offers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {offers.map((offer) => (
                            <Card key={offer.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-50 dark:border-slate-800">
                                <CardContent className="p-0">
                                    <div className="flex flex-col lg:flex-row items-stretch">
                                        {/* Left Side: Offer Main Info */}
                                        <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                            {/* Driver Profile */}
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-brand-primary border border-slate-100 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform">
                                                    {offer.driver?.profile_picture ? (
                                                        <img src={offer.driver.profile_picture} className="h-full w-full object-cover rounded-2xl" alt="" />
                                                    ) : (
                                                        <User className="h-8 w-8" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                                        {offer.driver?.full_name || offer.driverName || "سائق مستور"}
                                                    </h3>
                                                    <div className="flex flex-col gap-1 mt-2">
                                                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                            <Truck className="h-3 w-3" />
                                                            {offer.driverDetails?.vehicle_type || "نقل عام"}
                                                        </p>
                                                        <p className="text-[10px] font-black text-brand-primary flex items-center gap-1.5">
                                                            <Clock className="h-3 w-3" />
                                                            {formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shipment Link */}
                                            <div className="flex-1 space-y-3 w-full border-r border-slate-100 dark:border-slate-800 pr-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black bg-brand-primary/5 text-brand-primary px-2.5 py-1 rounded-lg">
                                                        #{offer.shipment?.id?.toString().slice(-6) || '---'}
                                                    </span>
                                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                                                        {getGoodsTypeLabel(offer.shipment?.goodsType) || 'شحنة'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                                                        <span>{offer.shipment?.pickupGovernorate}</span>
                                                    </div>
                                                    <ArrowLeftRight className="h-3 w-3 opacity-30" />
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5 text-red-500" />
                                                        <span>{offer.shipment?.destinationGovernorate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Price & Action */}
                                        <div className="bg-slate-50/50 dark:bg-slate-800/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 min-w-[450px]">
                                            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                                                {/* Time Block */}
                                                <div className="flex-1 text-center bg-white dark:bg-slate-900/50 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                                    <span className="block text-[9px] text-slate-400 font-black mb-1 uppercase tracking-tighter leading-none">⏱️ وقت التوصيل</span>
                                                    <div className="flex items-baseline justify-center gap-1">
                                                        <span className="text-sm font-black text-brand-primary whitespace-nowrap">
                                                            {formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Price Block */}
                                                <div className="flex-1 text-center bg-brand-primary/5 px-4 py-3 rounded-2xl border border-brand-primary/10">
                                                    <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">💰 العرض</p>
                                                    <div className="flex items-baseline justify-center gap-1">
                                                        <span className="text-2xl font-black text-brand-primary tracking-tighter">
                                                            {offer.amount || offer.price}
                                                        </span>
                                                        <span className="text-[10px] font-black text-brand-primary/60">EGP</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <Link
                                                    to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`}
                                                    className="flex-1 md:flex-none"
                                                >
                                                    <Button className="w-full md:px-8 h-12 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20 group/btn transition-all active:scale-[0.98]">
                                                        التفاوض والقبول
                                                        <ChevronLeft className="mr-2 h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 py-32 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-inner text-slate-300">
                            <TrendingUp className="h-10 w-10 opacity-20" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">لا توجد عروض جديدة</h3>
                        <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">بمجرد قيام السائقين بتقديم عروض سعر على شحناتك المتاحة، ستظهر جميعها هنا للمقارنة والتفاوض.</p>
                        <Link to="/customer/shipments" className="mt-8">
                            <Button variant="outline" className="h-12 rounded-2xl px-10 font-black border-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                                العودة لشحناتي
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
