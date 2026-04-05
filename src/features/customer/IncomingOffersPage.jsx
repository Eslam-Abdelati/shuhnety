import { useState, useEffect } from 'react'
import {
    Clock,
    Loader2,
    User,
    ChevronLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { shipmentService } from '@/services/shipmentService'
import { formatEstimatedTime, mapShipmentData } from '@/utils/shipmentUtils'

export const IncomingOffersPage = () => {
    const [offers, setOffers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOffers = async () => {
        setIsLoading(true)
        try {
            const rawData = await shipmentService.getNewBids()
            const offersArray = Array.isArray(rawData) ? rawData : (rawData.data || [])
            
            // Map the shipment data within each offer for precision
            const processedOffers = offersArray.map(offer => ({
                ...offer,
                shipment: offer.shipment ? mapShipmentData(offer.shipment) : null
            }))
            
            setOffers(processedOffers)
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
                <p className="text-slate-500 font-bold">جاري تحميل قائمة العروض...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 font-cairo px-4" dir="rtl">
            {/* Simple Header */}
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">العروض الواردة</h1>
                    <p className="text-sm font-bold text-slate-400 mt-1">إليك أحدث العروض المقدمة من السائقين</p>
                </div>
                <Button
                    onClick={fetchOffers}
                    variant="ghost"
                    className="h-11 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <Clock className="ml-2 h-4 w-4 opacity-50" />
                    تحديث
                </Button>
            </div>

            {/* Ultra-Simple Cards */}
            <div className="space-y-4">
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <Card key={offer.id} className="overflow-hidden border border-slate-100 shadow-sm hover:border-brand-primary/20 transition-all duration-300 bg-white rounded-[2rem]">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    
                                    {/* 1. Driver Name */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary border border-slate-100">
                                            {offer.driver?.profile_picture ? (
                                                <img src={offer.driver.profile_picture} className="h-full w-full object-cover rounded-2xl" alt="" />
                                            ) : (
                                                <User className="h-6 w-6 opacity-30" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-slate-800 leading-none mb-1.5">{offer.driver?.full_name || "سائق"}</h3>
                                            <p className="text-xs font-bold text-slate-400">مقدم عرض سعر لشحنتك</p>
                                        </div>
                                    </div>

                                    {/* 2. Price & 3. Time */}
                                    <div className="flex items-center gap-8 md:gap-12 px-6 py-3 bg-slate-50/50 rounded-2xl border border-slate-50">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">عرض السعر</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-slate-800 tracking-tighter">
                                                    {parseFloat(offer.negotiatedAmount || offer.amount || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">ج.م</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">وقت الوصول</p>
                                            <span className="text-sm font-black text-brand-primary">
                                                يصل في {formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 4. Action Button */}
                                    <div className="w-full md:w-auto">
                                        <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`}>
                                            <Button className="w-full md:w-[160px] h-12 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/10 hover:translate-y-[-1px] active:scale-[0.98] transition-all">
                                                تفاصيل العرض
                                                <ChevronLeft className="mr-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 py-32 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                            <Clock className="h-8 w-8 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">لا توجد عروض حالية</h3>
                        <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto mb-8">سيظهر هنا فور قيام السائقين بتقديم عروض سعر لشحناتك المتاحة.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
