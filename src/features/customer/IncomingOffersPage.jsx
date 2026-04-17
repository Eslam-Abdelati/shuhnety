import { useState, useEffect } from 'react'
import {
    Clock,
    User,
    ChevronLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
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
            const offersArray = Array.isArray(rawData)
                ? rawData
                : (rawData?.data?.bids && Array.isArray(rawData.data.bids))
                    ? rawData.data.bids
                    : (rawData?.data && Array.isArray(rawData.data))
                        ? rawData.data
                        : (rawData?.bids && Array.isArray(rawData.bids))
                            ? rawData.bids
                            : [];

            // Map the shipment data within each offer for precision
            const processedOffers = offersArray.map(offer => ({
                ...offer,
                shipment: offer.shipment ? mapShipmentData(offer.shipment) : null
            }))
            console.log('Incoming Offers List:', processedOffers)
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
        return <Loading text="جاري تحميل قائمة العروض..." />
    }

    return (
        <div className="space-y-5 md:space-y-6 md:px-2 animate-in fade-in duration-700 font-cairo" dir="rtl">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[1.25rem] md:rounded-[2rem] bg-gradient-to-br from-brand-secondary to-[#043328] p-5 md:p-8 text-white shadow-lg">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black mb-2 tracking-tight">العروض الواردة</h1>
                        <p className="text-white/80 text-xs md:text-sm max-w-xl leading-relaxed">
                            إليك أحدث العروض المقدمة من الكباتن لشحناتك المتاحة.
                        </p>
                    </div>

                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-5 md:gap-6">
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <Card key={offer.id} className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-none transition-all duration-500 rounded-[1.25rem] md:rounded-[2rem]">
                            <CardContent className="p-3 md:p-4 lg:p-5">
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
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h3 className="font-black text-lg text-slate-800 leading-none">{offer.driver?.full_name || "كابتن"}</h3>
                                            </div>
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
                                                يصل في {formatEstimatedTime(String(offer.estimatedTime || offer.estimated_time || ''))}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 4. Action Button */}
                                    <div className="w-full md:w-auto">
                                        <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`}>
                                            <Button className="w-full md:w-[160px] h-12 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/10 hover:translate-y-[-1px] active:scale-[0.98] transition-all cursor-pointer">
                                                تفاصيل العرض
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[3.5rem] p-10 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                            <div className="absolute -top-24 -left-24 w-64 md:w-80 h-64 md:h-80 bg-brand-primary blur-[80px] md:blur-[100px] rounded-full"></div>
                            <div className="absolute -bottom-24 -right-24 w-64 md:w-80 h-64 md:h-80 bg-brand-secondary blur-[80px] md:blur-[100px] rounded-full"></div>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-20 w-20 md:h-28 md:w-28 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center mb-5 md:mb-8 shadow-inner border border-slate-100 dark:border-slate-800">
                                <Clock className="h-8 w-8 md:h-14 md:w-14 text-slate-200" />
                            </div>
                            <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-2 md:mb-3">لا توجد عروض حالية</h3>
                            <p className="text-slate-500 font-bold mb-7 md:mb-10 max-w-sm mx-auto leading-relaxed text-xs md:text-base text-center">
                                سيظهر هنا فور قيام الكباتن بتقديم عروض سعر لشحناتك المتاحة.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

