import { Link } from 'react-router-dom'
import {
    Package,
    CheckCircle,
    MapPin,
    Search,
    ArrowLeftRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Box,
    FileText,
    Weight,
    Plus,
    TrendingUp,
    ShieldCheck,
    Edit,
    Trash2,
} from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useShipmentStore } from '@/store/useShipmentStore'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getGoodsTypeLabel, getStatusStyles } from '@/utils/shipmentUtils'
import { shipmentService } from '@/services/shipmentService'
import QuickCounter from '@/components/ui/QuickCounter'
import { Pagination } from '@/components/ui/Pagination'
import DashboardStats from './components/DashboardStats'

export const ShipmentsPage = () => {
    const { shipments, deleteShipment, setShipments } = useShipmentStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('الكل')
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [apiStats, setApiStats] = useState({
        total: 0,
        in_progress: 0,
        completed: 0
    })
    const [isStatsLoading, setIsStatsLoading] = useState(false)

    // Map frontend statuses to API statuses
    const statusMap = {
        'الكل': null,
        'في انتظار العروض': 'pending',
        'عروض رهن المراجعة': 'has_offers',
        'في الطريق للاستلام': 'pickup_in_progress',
        'جاري التوصيل': 'delivery_in_progress',
        'تم التوصيل': 'delivered',
        'ملغي': 'canceled'
    }

    const fetchShipments = async (pageNum = 1) => {
        const take = 5;
        const skip = (pageNum - 1) * take;

        setIsLoading(true);

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });

            const result = await shipmentService.searchShipments(
                { skip, take: take + 1 },
                {
                    search: searchQuery,
                    status: statusMap[filterStatus] || null
                }
            )

            const fetchedData = result.data?.shipments || (Array.isArray(result.data) ? result.data : [])

            setHasMore(fetchedData.length > take);
            setShipments(fetchedData.slice(0, take));

        } catch (error) {
            console.error('Failed to fetch shipments:', error)
        } finally {
            setIsLoading(false);
        }
    }

    const handleNextPage = () => {
        if (!hasMore || isLoading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchShipments(nextPage);
    }

    const handlePrevPage = () => {
        if (page <= 1 || isLoading) return;
        const prevPage = page - 1;
        setPage(prevPage);
        fetchShipments(prevPage);
    }

    const fetchStats = async () => {
        setIsStatsLoading(true)
        try {
            const statsRes = await shipmentService.getShipmentStats()
            if (statsRes && statsRes.status && statsRes.data) {
                const statsData = statsRes.data;
                setApiStats({
                    total: statsData.totalShipments || 0,
                    in_progress: statsData.inProgressShipments || 0,
                    completed: statsData.completedShipments || 0
                })
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        } finally {
            setIsStatsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    useEffect(() => {
        setPage(1);
        fetchShipments(1);
    }, [filterStatus])

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchShipments(1);
        }, 600)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleCancelShipment = async (id) => {
        if (window.confirm('هل أنت متأكد من إلغاء هذه الشحنة؟')) {
            try {
                await shipmentService.cancelShipment(id);
                deleteShipment(id); // Remove from store state locally
                // fetchStats(); // Refresh stats if needed
            } catch (error) {
                console.error('Cancellation failed:', error);
                toast.error(error.message || 'فشل في إلغاء الشحنة');
            }
        }
    };

    const statuses = [
        'الكل',
        'في انتظار العروض',
        'عروض رهن المراجعة',
        'في الطريق للاستلام',
        'جاري التوصيل',
        'تم التوصيل',
        'ملغي'
    ]

    // API handles filtering



    return (
        <div className="space-y-5 md:space-y-6 md:px-2" dir="rtl">
            {/* Upper Header Section */}
            <div className="relative overflow-hidden rounded-[1.25rem] md:rounded-[2rem] bg-gradient-to-br from-brand-secondary to-[#043328] p-5 md:p-10 text-white shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xl md:text-2xl font-black mb-2 md:mb-3 tracking-tight"
                        >
                            شحناتي
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/80 text-xs md:text-sm max-w-xl leading-relaxed"
                        >
                            تابع جميع عمليات النقل الخاصة بك بكل سهولة واحترافية. نحن هنا لضمان وصول بضائعك بأمان.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="shrink-0"
                    >
                        <Link to="/customer/create" className="block w-full">
                            <Button className="w-full md:w-auto bg-brand-primary hover:bg-orange-600 text-white rounded-xl md:rounded-2xl gap-2.5 px-6 md:px-8 h-11 md:h-14 text-xs md:text-sm font-black shadow-lg hover:-translate-y-0.5 transition-all border-none">
                                <Plus className="h-4.5 w-4.5 md:h-5 md:w-5" />
                                إنشاء شحنة جديدة
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Stats Grid */}
            <DashboardStats statsData={apiStats} isLoading={isStatsLoading} />

            {/* Filters Bar */}
            <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-slate-900 rounded-[1.25rem] md:rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
                <CardContent className="p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col gap-6">
                        {/* Search Input */}
                        <div className="relative group w-full">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 bg-slate-50 dark:bg-slate-800 rounded-lg md:rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-orange-50 group-focus-within:text-brand-primary transition-all duration-300">
                                <Search className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="ابحث برقم الشحنة، اسم المستلم، أو نقطة المدينة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 md:h-15 bg-white dark:bg-slate-800/20 border-2 border-slate-100 dark:border-slate-800 rounded-xl md:rounded-2xl pr-14 md:pr-18 pl-6 text-[10px] md:text-sm font-bold outline-none focus:border-brand-primary/20 focus:bg-white dark:focus:bg-slate-800 transition-all font-cairo shadow-sm focus:shadow-md"
                            />
                        </div>

                        {/* Status Filter Tabs - Wrapped, no scroll */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {statuses.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-4 md:px-5 h-9 md:h-11 rounded-lg md:rounded-xl text-[9px] md:text-[11px] font-black transition-all border duration-300",
                                        filterStatus === status
                                            ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-orange-500/20 scale-[1.02]"
                                            : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-5 md:gap-6">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <Loading section={true} text="جاري تحميل شحناتك الرائعة..." className="py-20 bg-white/50 dark:bg-slate-900/50 rounded-[2rem] backdrop-blur-sm" />
                    ) : shipments.length > 0 ? (
                        shipments.map((shipment, i) => {
                            const styles = getStatusStyles(shipment.status);

                            return (
                                <motion.div
                                    key={shipment.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    layout
                                >
                                    <Card className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-none transition-all duration-500 rounded-[1.25rem] md:rounded-[2rem]">
                                        {/* Status Accent Bar */}
                                        <div className={cn("absolute top-0 right-0 w-1 md:w-1.5 h-full", getStatusStyles(shipment.status).dot)}></div>

                                        <CardContent className="p-0">
                                            <div className="p-3 md:p-4 lg:p-5 pb-2 md:pb-2 lg:pb-2">
                                                {/* Card Header */}
                                                <div className="flex flex-wrap items-start justify-between gap-2.5 md:gap-4 mb-2.5 md:mb-3">
                                                    <div className="flex items-center gap-3 md:gap-4">
                                                        <div className={cn("h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl flex items-center justify-center transition-transform group-hover:rotate-3 duration-300 shadow-xs", getStatusStyles(shipment.status).bg, getStatusStyles(shipment.status).text)}>
                                                            <Package className="h-4 w-4 md:h-5 md:w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                <h3 className="text-xs md:text-sm font-black text-blue-600 dark:text-blue-400">
                                                                    {getGoodsTypeLabel(shipment.goodsType)}
                                                                </h3>
                                                                <div className={cn("px-2 md:px-2.5 py-0.5 md:py-0.5 rounded-full text-[7.5px] md:text-[9px] font-black border uppercase tracking-tight", getStatusStyles(shipment.status).bg, getStatusStyles(shipment.status).text, getStatusStyles(shipment.status).border)}>
                                                                    {shipment.status}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-2 md:gap-2.5 text-[8.5px] md:text-[10px] font-bold text-slate-500">
                                                                <span className="text-slate-600 dark:text-slate-400 font-black tracking-widest font-mono select-all">
                                                                    {shipment.displayId}
                                                                </span>
                                                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full hidden sm:block"></span>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {shipment.createdAt ? format(new Date(shipment.createdAt), 'dd MMMM yyyy • hh:mm a', { locale: ar }) : '--'}
                                                                </span>
                                                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full hidden sm:block"></span>
                                                                <span className="flex items-center gap-1">
                                                                    <Weight className="h-3 w-3" />
                                                                    {shipment.weight} كجم
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-md border border-slate-100 dark:border-slate-800">
                                                        <div className="h-5 w-5 md:h-7 md:w-7 bg-white dark:bg-slate-800 rounded-md flex items-center justify-center shadow-xs">
                                                            <ShieldCheck className="h-3 w-3 md:h-4 md:w-4 text-emerald-600" />
                                                        </div>
                                                        <div className="pl-1.5 pr-0.5">
                                                            <p className="text-[6px] md:text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">الضمان</p>
                                                            <p className="text-[8px] md:text-[9.5px] font-black text-slate-700 dark:text-slate-200 leading-none">شحنة مؤمنة</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Path Information */}
                                                <div className="flex items-start justify-between gap-1 mt-1 mb-1.5 md:mb-2 bg-slate-50/50 dark:bg-slate-800/30 p-2 md:p-3 rounded-xl border border-slate-100 dark:border-slate-800 relative">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-1.5">
                                                            <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500 shrink-0" />
                                                            <p className="text-[8.5px] md:text-[11px] font-black text-emerald-600 uppercase tracking-tight">نقطة التحميل</p>
                                                        </div>
                                                        <h4 className="text-[10px] md:text-sm font-black text-slate-900 dark:text-white mb-0.5 truncate pr-5">{shipment.pickupGovernorate}، {shipment.pickupCity}</h4>
                                                        <p className="text-[8.5px] md:text-xs font-bold text-slate-500 truncate pr-5">{shipment.pickupAddress}</p>
                                                    </div>

                                                    <div className="shrink-0 px-1 flex flex-col items-center justify-center self-center relative w-10 md:w-16">
                                                        <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-slate-200 dark:bg-slate-700 -translate-y-1/2"></div>
                                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm relative z-10">
                                                            <ArrowLeftRight className="h-3 w-3 md:h-4 md:w-4 text-slate-400" />
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-1.5">
                                                            <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-500 shrink-0" />
                                                            <p className="text-[8.5px] md:text-[11px] font-black text-red-600 uppercase tracking-tight">نقطة التسليم</p>
                                                        </div>
                                                        <h4 className="text-[10px] md:text-sm font-black text-slate-900 dark:text-white mb-0.5 truncate pr-5">{shipment.destinationGovernorate}، {shipment.destinationCity}</h4>
                                                        <p className="text-[8.5px] md:text-xs font-bold text-slate-500 truncate pr-5">{shipment.destinationAddress}</p>
                                                    </div>
                                                </div>


                                            </div>

                                            {/* Footer Actions */}
                                            <div className="px-3 md:px-5 py-2.5 md:py-3.5 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
                                                {(() => {
                                                    const shipmentBids = shipment?.bids || [];
                                                    const acceptedBid = shipmentBids.find(o => o.status === 'accepted');
                                                    const displayPrice = acceptedBid ? acceptedBid.amount : null;
                                                    const offersCount = shipmentBids.length;

                                                    return (
                                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 md:gap-6">
                                                            <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
                                                                <p className="text-[7.5px] md:text-[9px] font-black text-slate-400 uppercase mb-0.5">
                                                                    السعر المتفق عليه
                                                                </p>
                                                                <div className="flex items-baseline gap-1 md:gap-1">
                                                                    <span className="text-base md:text-lg font-black text-brand-secondary dark:text-emerald-500">
                                                                        {displayPrice || 'لم يحدد بعد'}
                                                                    </span>
                                                                    {displayPrice && <span className="text-[8px] md:text-[10px] font-bold text-slate-500 whitespace-nowrap">EGP</span>}
                                                                </div>
                                                            </div>

                                                            {offersCount > 0 && (
                                                                <>
                                                                    <div className="h-8 md:h-10 w-[1.5px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                                                                    <Link to={`/customer/bids/${shipment.id}`} className="flex flex-col items-center sm:items-start text-center sm:text-right group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-brand-primary/20 hover:shadow-sm">
                                                                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-0.5 flex items-center gap-1.5">
                                                                            <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3 group-hover:text-brand-primary transition-colors" />
                                                                            عروض الكباتن
                                                                        </p>
                                                                        <div className="flex items-baseline gap-1.5">
                                                                            <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                                                                                {offersCount}
                                                                            </span>
                                                                            <span className="text-[9px] md:text-[11px] font-bold text-slate-500">متاح</span>
                                                                        </div>
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    )
                                                })()}

                                                <div className="flex items-center justify-center sm:justify-end flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                    <Link to={`/customer/shipments/${shipment.id}`} className="shrink-0">
                                                        <button className="h-10 px-6 min-w-[110px] flex items-center justify-center gap-2 rounded-xl text-[10px] md:text-[11px] font-black text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-all group border-2 border-brand-primary/5 hover:border-brand-primary/10 shadow-sm">
                                                            <FileText className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                                            التفاصيل
                                                        </button>
                                                    </Link>

                                                    {['في انتظار العروض', 'عروض رهن المراجعة'].includes(shipment.status) && (
                                                        <>
                                                            <Link to={`/customer/edit/${shipment.id}`}>
                                                                <button
                                                                    className="flex items-center justify-center gap-1 px-2.5 py-1.5 md:py-2 rounded-full text-[9px] md:text-[11px] font-black text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all group"
                                                                >
                                                                    <Edit className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:scale-110 transition-transform" />
                                                                    تعديل
                                                                </button>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleCancelShipment(shipment.id)}
                                                                className="flex items-center justify-center gap-1 px-2.5 py-1.5 md:py-2 rounded-full text-[9px] md:text-[11px] font-black text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all group"
                                                            >
                                                                <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5 group-hover:scale-110 transition-transform" />
                                                                إلغاء
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card className="border-none shadow-sm dark:shadow-none bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[3.5rem] p-10 md:p-20 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                                    <div className="absolute -top-24 -left-24 w-64 md:w-80 h-64 md:h-80 bg-brand-primary blur-[80px] md:blur-[100px] rounded-full"></div>
                                    <div className="absolute -bottom-24 -right-24 w-64 md:w-80 h-64 md:h-80 bg-brand-secondary blur-[80px] md:blur-[100px] rounded-full"></div>
                                </div>

                                <div className="relative z-10">
                                    <div className="h-20 w-20 md:h-28 md:w-28 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-5 md:mb-8 shadow-inner border border-slate-100 dark:border-slate-800">
                                        <Box className="h-8 w-8 md:h-14 md:w-14 text-slate-200" />
                                    </div>
                                    <h4 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-2 md:mb-3">لا توجد نتائج بحث</h4>
                                    <p className="text-slate-500 font-bold mb-7 md:mb-10 max-w-sm mx-auto leading-relaxed text-xs md:text-base">
                                        لم نتمكن من العثور على أي شحنات تطابق معايير بحثك الحالية.
                                    </p>
                                    <Link to="/customer/create">
                                        <Button className="bg-brand-secondary hover:bg-[#043d2e] text-white rounded-xl md:rounded-2xl gap-2.5 md:gap-3 px-6 md:px-10 h-11 md:h-14 text-xs md:text-sm font-black shadow-lg">
                                            <Plus className="h-4 w-4 md:h-5 md:w-5" />
                                            إضافة شحنة جديدة
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reusable Pagination Component (Unified) */}
                {shipments.length > 0 && (
                    <Pagination
                        currentPage={page}
                        onPageChange={(p) => {
                            setPage(p);
                            fetchShipments(p);
                        }}
                        loading={isLoading}
                        hasMore={hasMore}
                    />
                )}
            </div>
        </div>
    )
}

