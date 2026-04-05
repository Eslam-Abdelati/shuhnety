import { useState, useEffect } from 'react'
import {
    Clock,
    Truck,
    MapPin,
    ArrowLeftRight,
    Loader2,
    CheckCircle,
    User,
    TrendingUp,
    ChevronLeft
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { shipmentService } from '@/services/shipmentService'
import { getGoodsTypeLabel, formatEstimatedTime } from '@/utils/shipmentUtils'
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
                <p className="text-slate-500 font-black">جاري تحميل قائمة العروض الوادرية...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 font-cairo" dir="rtl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h3 className="text-xl md:text-2xl font-black mb-1 md:mb-2 tracking-tight flex items-center gap-3">
                        العروض الواردة
                        <div className="h-2 w-2 rounded-full bg-brand-primary animate-pulse"></div>
                    </h3>
                    <p className="text-xs md:text-sm font-bold text-slate-500">إليك أحدث العروض المقدمة من السائقين على شحناتك النشطة</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={fetchOffers}
                        variant="ghost"
                        className="h-11 rounded-xl font-black text-slate-600 dark:text-slate-400 group bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800"
                    >
                        <Clock className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                        تحديث القائمة
                    </Button>
                </div>
            </div>

            {/* Offers List */}
            <div className="space-y-6">
                {offers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {offers.map((offer) => (
                            <Card key={offer.id} className="group overflow-hidden border-none shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                <CardContent className="p-0">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Main Info Section */}
                                        <div className="flex-1 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
                                            {/* Driver Profile */}
                                            <div className="flex items-center gap-4 min-w-[220px]">
                                                <div className="relative h-16 w-16 shrink-0">
                                                    <div className="h-full w-full rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-brand-primary border border-slate-100 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                                                        {offer.driver?.profile_picture ? (
                                                            <img src={offer.driver.profile_picture} className="h-full w-full object-cover" alt="" />
                                                        ) : (
                                                            <User className="h-7 w-7" />
                                                        )}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1.5 flex items-center gap-2">
                                                        {offer.driver?.full_name || offer.driverName || "سائق"}
                                                        <CheckCircle className="h-4 w-4 text-brand-primary" />
                                                    </h4>
                                                    <div className="flex flex-col gap-1">
                                                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                                            <Truck className="h-3.5 w-3.5" />
                                                            {offer.driverDetails?.vehicle_type || "نقل عام"}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-md text-[9px] font-black uppercase tracking-widest">موثق</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Route Section */}
                                            <div className="flex-1 w-full sm:border-r sm:border-slate-100 dark:sm:border-slate-800 sm:pr-8">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                                        #{offer.shipment?.id?.toString().slice(-6) || '---'}
                                                    </span>
                                                    <span className="text-[11px] font-black text-brand-primary px-2.5 py-1 bg-brand-primary/5 rounded-lg">
                                                        {getGoodsTypeLabel(offer.shipment?.goodsType) || 'شحنة عامة'}
                                                    </span>
                                                </div>
                                                
                                                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></div>
                                                            <span className="truncate max-w-[100px]">{offer.shipment?.pickupGovernorate}</span>
                                                        </div>
                                                        <ArrowLeftRight className="h-3 w-3 text-slate-300" />
                                                        <div className="flex items-center gap-2 text-left">
                                                            <span className="truncate max-w-[100px]">{offer.shipment?.destinationGovernorate}</span>
                                                            <div className="h-2 w-2 rounded-full bg-red-500 shrink-0"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action & Price Section */}
                                        <div className="bg-slate-50/80 dark:bg-slate-800/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 lg:w-[420px] lg:border-r lg:border-slate-100 dark:lg:border-slate-800">
                                            <div className="grid grid-cols-2 gap-4 w-full sm:flex-1">
                                                {/* Time Block */}
                                                <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center">
                                                    <span className="block text-[9px] text-slate-400 font-black mb-1 uppercase tracking-tighter">التوصيل</span>
                                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                        {formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}
                                                    </span>
                                                </div>

                                                {/* Price Block */}
                                                <div className="bg-brand-primary text-white px-4 py-3 rounded-2xl shadow-xl shadow-brand-primary/20 flex flex-col justify-center items-center">
                                                    <span className="block text-[10px] opacity-70 font-black mb-0.5 uppercase tracking-widest">قيمة العرض</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-lg font-black tracking-tighter leading-none">
                                                            {parseFloat(offer.amount || offer.price || 0).toLocaleString('ar-EG')}
                                                        </span>
                                                        <span className="text-[9px] opacity-60 font-bold uppercase">ج.م</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 w-full sm:w-auto">
                                                <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`} className="w-full">
                                                    <Button className="w-full sm:w-[140px] h-12 bg-white hover:bg-slate-50 text-brand-primary border-2 border-brand-primary rounded-2xl font-black shadow-sm transition-all flex items-center justify-center gap-2 group/btn">
                                                        <TrendingUp className="h-4 w-4" />
                                                        تفاوض
                                                    </Button>
                                                </Link>
                                                <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`} className="w-full">
                                                    <Button className="w-full sm:w-[140px] h-12 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-black shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 group/btn">
                                                        قبول العرض
                                                        <ChevronLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
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
