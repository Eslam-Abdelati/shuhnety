import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Package,
    MapPin,
    Clock,
    ChevronLeft,
    Truck,
    Box,
    Calendar,
    ArrowLeftRight,
    Weight,
    Search
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { Loading } from '@/components/ui/Loading'
import { shipmentService } from '@/services/shipmentService'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'react-hot-toast'
import { getGoodsTypeLabel, getStatusStyles, mapShipmentData } from '@/utils/shipmentUtils'
import { Pagination } from '@/components/ui/Pagination'

export const ActiveShipments = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('الكل')
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const statusMap = {
        'الكل': null,
        'في الطريق للاستلام': 'pickup_in_progress',
        'جاري التوصيل': 'delivery_in_progress',
        'تم الوصول': 'arrived',
        'تم التسليم': 'delivered',
        'ملغي': 'canceled'
    }

    const statuses = ['الكل', 'في الطريق للاستلام', 'جاري التوصيل', 'تم الوصول', 'تم التسليم', 'ملغي']

    const fetchActiveShipments = async () => {
        setLoading(true)
        try {
            // Fetch a large enough set to handle filtering and pagination locally 
            // since the backend currently returns all data without filtering support.
            const response = await shipmentService.getAssignedShipments({
                skip: 0,
                take: 200 // Assuming most drivers won't have more than 200 history items
            })

            const data = response.data?.shipments || (Array.isArray(response.data) ? response.data : [])
            const mappedData = data.map(s => mapShipmentData(s))
            setShipments(mappedData)
        } catch (error) {
            console.error('Failed to fetch assigned shipments:', error)
            toast.error('تعذر تحميل رحلاتك')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActiveShipments();
    }, [])

    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        setIsFiltering(true);
        const timer = setTimeout(() => {
            setPage(1);
            setIsFiltering(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [filterStatus]);

    useEffect(() => {
        setIsFiltering(true);
        const timer = setTimeout(() => {
            setPage(1);
            setIsFiltering(false);
        }, 600);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // This is where the magic happens: Filter first, then paginate the results
    const filteredShipments = shipments.filter(s => {
        // Status Filter
        const targetStatusOriginal = statusMap[filterStatus];

        // Specific check for "في الطريق للاستلام" mapping to "قيد التنفيذ"
        const isPickupProgress = filterStatus === 'في الطريق للاستلام' && s.status === 'قيد التنفيذ';

        const matchesStatus = filterStatus === 'الكل' ||
            s.status_original === targetStatusOriginal ||
            s.status === filterStatus ||
            (filterStatus === 'تم الوصول' && (s.status_original === 'arrived' || s.status === 'تم الوصول')) ||
            isPickupProgress;

        // Search Filter
        const searchInput = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            (s.displayId || '').toLowerCase().includes(searchInput) ||
            (s.pickupGovernorate || '').toLowerCase().includes(searchInput) ||
            (s.destinationGovernorate || '').toLowerCase().includes(searchInput) ||
            (s.pickupCity || '').toLowerCase().includes(searchInput) ||
            (s.destinationCity || '').toLowerCase().includes(searchInput);

        return matchesStatus && matchesSearch;
    })

    const pageSize = 10;
    const paginatedShipments = filteredShipments.slice((page - 1) * pageSize, page * pageSize);
    const hasMoreItems = filteredShipments.length > page * pageSize;

    const showLoading = loading || isFiltering;

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col gap-1 items-start mb-8 font-cairo">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">سجل رحلاتي</h1>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    {shipments.length} رحلة إجمالاً
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden border border-slate-100 font-cairo">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-6">
                        <div className="relative group w-full">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-orange-50 group-focus-within:text-brand-primary transition-all duration-300">
                                <Search className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="ابحث برقم الشحنة، المحافظة، أو المدينة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-15 bg-white border-2 border-slate-100 rounded-2xl pr-18 pl-6 text-sm font-bold outline-none focus:border-brand-primary/20 transition-all font-cairo shadow-sm focus:shadow-md"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {statuses.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-4 h-10 rounded-xl text-[10px] font-black transition-all border duration-300",
                                        filterStatus === status
                                            ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-orange-500/20 scale-[1.02]"
                                            : "bg-slate-50 text-slate-500 border-transparent hover:border-slate-200 hover:bg-slate-100"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shipments List Section */}
            <div className="space-y-4 font-cairo min-h-[300px] relative">
                {showLoading ? (
                    <Loading section={true} text="جاري تحديث القائمة..." className="py-20 bg-white/50 backdrop-blur-sm rounded-[3.5rem] border-2 border-dashed border-slate-100" />
                ) : paginatedShipments.length > 0 ? (
                    paginatedShipments.map((s) => {
                        const statusStyle = getStatusStyles(s.status)
                        return (
                            <div
                                key={s.id}
                                onClick={() => navigate(`/driver/available/${s.id}`)}
                                className="rounded-[2.5rem] border border-slate-200/60 bg-white text-card-foreground shadow-[0_20px_50px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] duration-500 group transition-all overflow-hidden cursor-pointer"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 rounded-xl flex items-center justify-center text-white transition-colors",
                                                s.status_original === 'delivered' ? 'bg-emerald-500' : 
                                                s.status_original === 'arrived' ? 'bg-sky-500' : 'bg-brand-primary'
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
                ) : shipments.length > 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                        <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-black">لا توجد رحلات تطابق هذا البحث</p>
                        <p className="text-slate-400 text-xs font-bold mt-2">جرب البحث بكلمات أخرى أو اختر حالة مختلفة</p>
                    </div>
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

            {/* Pagination mirroring customer dashboard logic, but handled locally for accurate filtering */}
            {filteredShipments.length > 0 && (
                <Pagination
                    currentPage={page}
                    onPageChange={(p) => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setPage(p);
                    }}
                    loading={showLoading}
                    hasMore={hasMoreItems}
                />
            )}
        </div>
    )
}
