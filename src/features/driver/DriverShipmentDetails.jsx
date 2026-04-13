import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Truck, Box, Calendar, Weight, Package,
    Maximize, Navigation, CheckCircle2, ShieldCheck,
    ArrowRight, AlertCircle, Phone, Clock, ChevronLeft, Map, Info, Lock, TrendingUp
} from 'lucide-react';
import { Loading } from '@/components/ui/Loading';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/Dialog";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';
import { getStatusStyles, getGoodsTypeLabel, mapShipmentData, formatEstimatedTime } from '@/utils/shipmentUtils';
import { shipmentService } from '@/services/shipmentService';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const DriverShipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showBidModal, setShowBidModal] = useState(false);
    const [bidForm, setBidForm] = useState({
        amount: '',
        days: '',
        hours: '',
        minutes: '',
        note: null
    });
    const [bidErrors, setBidErrors] = useState({});
    const [submittingBid, setSubmittingBid] = useState(false);
    const [showNegotiateInput, setShowNegotiateInput] = useState(false);
    const [negotiateAmount, setNegotiateAmount] = useState('');


    useEffect(() => {
        fetchShipmentDetails();
    }, [id]);

    const formatDimension = (value) => {
        if (!value) return '-';
        const num = parseFloat(value);
        return isNaN(num) ? '-' : num.toFixed(2);
    };

    const fetchShipmentDetails = async () => {
        try {
            setLoading(true);
            const data = await shipmentService.getShipmentById(id);
            setShipment(data.status_original ? data : mapShipmentData(data));
            console.log('Shipment Data:', data);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('خطأ في تحميل تفاصيل الشحنة');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitBid = async (e) => {
        if (e) e.preventDefault();
        const errors = {};

        // Validation Logic
        const amount = parseFloat(bidForm.amount);
        const totalMinutes = (parseInt(bidForm.days || 0) * 24 * 60) +
            (parseInt(bidForm.hours || 0) * 60) +
            (parseInt(bidForm.minutes || 0));

        if (!bidForm.amount || amount <= 0) {
            errors.amount = 'يرجى إدخال سعر صحيح';
        }

        if (totalMinutes <= 0) {
            errors.time = 'يرجى تحديد وقت التوصيل';
        }

        if (Object.keys(errors).length > 0) {
            setBidErrors(errors);
            toast.error('يرجى إكمال البيانات المطلوبة');
            return;
        }

        try {
            setSubmittingBid(true);
            setBidErrors({});
            const bidData = {
                amount: amount,
                estimatedTime: totalMinutes,
                note: bidForm.note || null,
                shipmentId: Number(id)
            };

            await shipmentService.submitBid(bidData);
            toast.success('تم تقديم عرضك بنجاح');
            setShowBidModal(false);
            // Reset form
            setBidForm({ amount: '', days: '', hours: '', minutes: '', note: '' });
            fetchShipmentDetails();
        } catch (err) {
            toast.error(err.message || 'فشل في تقديم العرض');
        } finally {
            setSubmittingBid(false);
        }
    };

    const handleAcceptNegotiatedPrice = async () => {
        try {
            setUpdating(true);
            await shipmentService.updateBidStatus(myBid.id, 'accepted');
            toast.success('تم قبول العرض المتفاوض عليه');
            fetchShipmentDetails();
        } catch (err) {
            toast.error('فشل في قبول العرض');
        } finally {
            setUpdating(false);
        }
    };

    const handleNegotiateSubmit = async () => {
        if (!negotiateAmount || parseFloat(negotiateAmount) <= 0) {
            toast.error('يرجى إدخال مبلغ صحيح');
            return;
        }

        try {
            setUpdating(true);
            await shipmentService.negotiateBid(myBid.id, negotiateAmount);
            toast.success('تم إرسال عرضك الجديد');
            setShowNegotiateInput(false);
            setNegotiateAmount('');
            fetchShipmentDetails();
        } catch (err) {
            toast.error(err.message || 'فشل في إرسال العرض');
        } finally {
            setUpdating(false);
        }
    };

    const handleStartNavigation = async () => {
        try {
            setUpdating(true);
            await shipmentService.updateShipmentStatus(id, 'delivery_in_progress');
            toast.success('تم بدء الرحلة');
            fetchShipmentDetails();
        } catch (err) {
            toast.error('فشل في تحديث الحالة');
        } finally {
            setUpdating(false);
        }
    };

    const handleArrived = async () => {
        try {
            setUpdating(true);
            await shipmentService.updateShipmentStatus(id, 'arrived');
            toast.success('تم تأكيد الوصول');
            fetchShipmentDetails();
        } catch (err) {
            toast.error('فشل في تأكيد الوصول');
        } finally {
            setUpdating(false);
        }
    };

    const handleCompleteDelivery = async () => {
        try {
            setUpdating(true);
            await shipmentService.updateShipmentStatus(id, 'delivered');
            toast.success('تم إتمام التوصيل بنجاح');
            fetchShipmentDetails();
        } catch (err) {
            toast.error('فشل في إتمام التوصيل');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await shipmentService.updateShipmentStatus(id, newStatus);
            // Relying on Backend Sockets for status update notification
            window.location.reload();
        } catch (err) {
            toast.error('فشل تحديث الحالة');
        } finally {
            setUpdating(false);
        }
    };

    const openInGoogleMaps = (gov, city, address) => {
        const query = encodeURIComponent(`${address || ''} ${city || ''} ${gov || ''}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    if (loading) return <Loading text="جاري تحميل بيانات الشحنة..." />

    if (error || !shipment) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
            <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">تعذر الوصول للبيانات</h3>
            <p className="text-slate-500 font-bold mb-8 max-w-xs mx-auto leading-relaxed">{error || 'لم نتمكن من العثور على هذه الشحنة'}</p>
            <Button onClick={() => navigate(-1)} className="min-w-[200px] h-14 bg-slate-900 text-white rounded-md font-black shadow-lg">العودة للخلف</Button>
        </div>
    );

    const rawStatus = shipment.status_original || shipment.status;
    const currentStatusStyle = getStatusStyles(rawStatus);

    // Check if the current driver has already submitted a bid (Backend only sends this driver's bids)
    const hasMyBid = shipment.bids && shipment.bids.length > 0;
    const myBid = hasMyBid ? shipment.bids[0] : null;
    const isOfferAccepted = myBid?.status === 'accepted' || myBid?.status === 'تم قبول العرض';
    const isPickupInProgress = rawStatus === 'pickup_in_progress' || rawStatus === 'قيد التنفيذ';
    const isDeliveryInProgress = rawStatus === 'delivery_in_progress' || rawStatus === 'جاري التوصيل';
    const isArrived = rawStatus === 'arrived' || rawStatus === 'تم الوصول';
    const isDelivered = rawStatus === 'delivered' || rawStatus === 'تم التسليم';

    return (
        <div className="max-w-5xl mx-auto pb-24 lg:pb-10 font-cairo" dir="rtl">
            {/* --- Standard Header --- */}
            <div className=" pb-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900">تفاصيل الشحنة</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">{getGoodsTypeLabel(shipment.goodsType)}</span>
                        <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{shipment.displayId}</span>
                    </div>
                </div>
            </div>

            {/* Mobile-only Price Summary - Right under header */}
            {hasMyBid && (
                <div className="lg:hidden mb-4 p-5 rounded-[2rem] bg-emerald-50 border border-emerald-100/50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center",
                                myBid?.negotiatedAmount ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                                {myBid?.negotiatedAmount ? <TrendingUp className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            </div>
                            <h3 className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                isOfferAccepted ? "text-emerald-600" : (myBid?.negotiatedAmount ? "text-amber-600" : "text-emerald-600")
                            )}>
                                {(isOfferAccepted && isPickupInProgress) ? 'تم قبول عرضك' : (isOfferAccepted ? 'السعر المتفق عليه' : (myBid?.negotiatedAmount ? 'عرض جديد' : 'عرضك الحالي'))}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-40">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-black">{formatEstimatedTime(myBid?.estimated_time || myBid?.estimatedTime)}</span>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className={cn(
                            "text-3xl font-black",
                            myBid?.negotiatedAmount ? "text-amber-600" : "text-slate-900"
                        )}>{myBid?.negotiatedAmount || myBid?.amount || '---'}</span>
                        <span className="text-sm font-bold text-slate-400">ج.م</span>
                        {myBid?.negotiatedAmount && (
                            <span className="ml-2 text-xs line-through text-slate-300 font-bold">{myBid.amount} ج.م</span>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* --- Main Content (Right Column) --- */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Path & Map Section */}
                    <Card className="rounded-[2rem] border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-8 w-8 bg-emerald-50 text-emerald-500 rounded-md flex items-center justify-center">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">مسار الشحنة</h3>
                            </div>

                            <div className="relative space-y-4 before:absolute before:right-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50 before:border-dashed before:border-r-2 before:border-slate-100">
                                {/* Pickup Point */}
                                <div className="relative flex items-start gap-4 mr-1">
                                    <div className="h-7 w-7 rounded-full bg-white border-4 border-emerald-500 shadow-lg shadow-emerald-500/20 z-10 flex items-center justify-center">
                                        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1 text-[10px] font-black text-emerald-600 uppercase">
                                            <span>نقطة التحميل</span>
                                            <button
                                                onClick={() => openInGoogleMaps(shipment.pickupGovernorate, shipment.pickupCity, shipment.pickupAddress)}
                                                className="flex items-center gap-1.5 hover:underline"
                                            >
                                                الخريطة <Map className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <p className="text-xs md:text-sm font-black text-slate-800 dark:text-white whitespace-nowrap">{shipment.pickupPoint}</p>
                                        <p className="text-sm font-bold text-slate-500 mt-1 leading-relaxed">{shipment.pickupAddress}</p>
                                    </div>
                                </div>

                                {/* Destination Point */}
                                <div className="relative flex items-start gap-4 mr-1">
                                    <div className="h-7 w-7 rounded-full bg-white border-4 border-brand-primary shadow-lg shadow-brand-primary/20 z-10 flex items-center justify-center">
                                        <div className="h-1.5 w-1.5 bg-brand-primary rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1 text-[10px] font-black text-brand-primary uppercase">
                                            <span>وجهة التوصيل</span>
                                            <button
                                                onClick={() => openInGoogleMaps(shipment.destinationGovernorate, shipment.destinationCity, shipment.destinationAddress)}
                                                className="flex items-center gap-1.5 hover:underline"
                                            >
                                                الخريطة <Map className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">{shipment.destinationPoint}</p>
                                        <p className="text-sm font-bold text-slate-500 mt-1 leading-relaxed">{shipment.destinationAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specifications Section */}
                    <Card className="rounded-[2rem] border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] p-6">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                <Box className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">مواصفات الشحنة</h3>
                        </div>

                        <div className="p-0 space-y-6 mb-6">
                            {/* Row 1: Core Info + Image */}
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 items-start">
                                {(shipment.shipment_image || shipment.shipmentImage) && (
                                    <div className="space-y-1">
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الصورة</p>
                                        <div
                                            onClick={() => window.open(shipment.shipment_image || shipment.shipmentImage, '_blank')}
                                            className="h-14 w-14 rounded-md overflow-hidden border-2 border-slate-50 shadow-sm cursor-zoom-in active:scale-95 transition-all bg-white"
                                        >
                                            <img
                                                src={shipment.shipment_image || shipment.shipmentImage}
                                                alt="Shipment"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">نوع الشحنة</p>
                                    <span className="text-[11px] md:text-sm font-black text-slate-800 dark:text-white truncate block">{getGoodsTypeLabel(shipment.goodsType)}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الوزن</p>
                                    <div className="flex items-center gap-1.5 text-[11px] md:text-sm font-black text-slate-800 dark:text-white">
                                        <Weight className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                                        <span className="whitespace-nowrap">{formatDimension(shipment.weight)} كجم</span>
                                    </div>
                                </div>
                                <div className="hidden md:block space-y-1">
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">تاريخ النشر</p>
                                    <div className="flex items-center gap-1.5 text-[11px] md:text-sm font-black text-slate-800 dark:text-white">
                                        <Calendar className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                                        <span className="whitespace-nowrap">{shipment.createdAt ? format(new Date(shipment.createdAt), 'dd MMMM', { locale: ar }) : '---'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Dimensions & Others */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                {(shipment.length || shipment.width || shipment.height || shipment.dimensions?.length || shipment.dimensions?.width || shipment.dimensions?.height) && (
                                    <div className="space-y-1">
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الأبعاد (سم)</p>
                                        <div className="flex items-center gap-1.5 text-xs md:text-sm font-black text-slate-800 dark:text-white">
                                            <Maximize className="h-3.5 w-3.5 text-brand-primary" />
                                            <span className="whitespace-nowrap">
                                                {formatDimension(shipment.length || shipment.dimensions?.length)} × {formatDimension(shipment.width || shipment.dimensions?.width)} × {formatDimension(shipment.height || shipment.dimensions?.height)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">نوع الشاحنة المطلوبة</p>
                                    <div className="flex items-center gap-1.5 text-xs md:text-sm font-black text-slate-800 dark:text-white">
                                        <Truck className="h-3.5 w-3.5 text-brand-primary" />
                                        <span className="whitespace-nowrap">{shipment.truckType || 'أي نوع متوفر'}</span>
                                    </div>
                                </div>
                                <div className="md:hidden space-y-1">
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">تاريخ النشر</p>
                                    <div className="flex items-center gap-1.5 text-xs md:text-sm font-black text-slate-800 dark:text-white">
                                        <Calendar className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                                        <span className="whitespace-nowrap">{shipment.createdAt ? format(new Date(shipment.createdAt), 'dd MMMM', { locale: ar }) : '---'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {shipment.description && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/50 rounded-2xl flex items-start gap-4">
                                    <Info className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">وصف وتفاصيل الحمولة</span>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{shipment.description}</p>
                                    </div>
                                </div>
                            )}

                            {shipment.note && shipment.note !== "لا يوجد ملاحظات" && (
                                <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex items-start gap-4">
                                    <AlertCircle className="h-5 w-5 text-brand-primary mt-1 shrink-0" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">ملاحظات إضافية وهامة</span>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{shipment.note}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* --- Sidebar (Left Column) --- */}
                <div className="space-y-4">

                    {/* Contacts Section (Conditional) */}
                    <Card className="rounded-[2rem] border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] p-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-6">بيانات التواصل</h4>

                        {(isOfferAccepted || shipment.driver_id === user?.id || shipment.driverId === user?.id) ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">العميل</p>
                                        <p className="text-sm font-black text-slate-900">{shipment.customerName}</p>
                                        <p className="text-xs font-bold text-slate-500">{shipment.customerPhone}</p>
                                    </div>
                                    <button onClick={() => window.open(`tel:${shipment.customerPhone}`)} className="h-10 w-10 bg-emerald-500 text-white rounded-md flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform">
                                        <Phone className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">المستلم</p>
                                        <p className="text-sm font-black text-slate-900">{shipment.recipientName}</p>
                                        <p className="text-xs font-bold text-slate-500">{shipment.recipientPhone}</p>
                                    </div>
                                    <button onClick={() => window.open(`tel:${shipment.recipientPhone}`)} className="h-10 w-10 bg-blue-500 text-white rounded-md flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-transform">
                                        <Phone className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 bg-amber-50/50 border border-amber-100/50 rounded-[2rem] text-center space-y-3">
                                <div className="h-12 w-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <p className="text-[11px] font-black text-amber-700 leading-relaxed">
                                    بيانات العميل والمستلم محجوبة حتى يتم قبول عرضك رسمياً
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* Actions Section - Modified for Sticky Mobile UX */}
                    <div className={cn(
                        "fixed bottom-0 left-0 right-0 lg:static bg-white/95 dark:bg-slate-900/95 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none border-t lg:border-none border-slate-200 dark:border-slate-800 p-4 lg:p-0 z-40 lg:z-auto shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] lg:shadow-none transition-all duration-300",
                        showBidModal && "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
                    )}>
                        {updating ? (
                            <Loading section={true} text="جاري التنفيذ..." className="p-8 bg-white/50 rounded-md border-2 border-dashed border-slate-100" />
                        ) : (
                            <div className="space-y-4">
                                {/* Persistent Offer Summary once bid exists */}
                                {hasMyBid && (
                                    <div className={cn(
                                        "hidden lg:block p-5 rounded-md border-none transition-all duration-300",
                                        isOfferAccepted ? "bg-emerald-50" : (myBid?.negotiatedAmount ? "bg-amber-50" : "bg-emerald-50/50")
                                    )}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-7 w-7 rounded-lg flex items-center justify-center",
                                                    myBid?.negotiatedAmount ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                                                )}>
                                                    {myBid?.negotiatedAmount ? <TrendingUp className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                                </div>
                                                <h3 className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest",
                                                    isOfferAccepted ? "text-emerald-600" : (myBid?.negotiatedAmount ? "text-amber-600" : "text-emerald-600")
                                                )}>
                                                    {(isOfferAccepted && isPickupInProgress) ? 'تم قبول العرض' : (isOfferAccepted ? 'السعر المتفق عليه' : (myBid?.negotiatedAmount ? 'عرض مقابل من العميل' : 'عرضك الحالي'))}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <Clock className="h-3 w-3" />
                                                <span className="text-[9px] font-black">{formatEstimatedTime(myBid?.estimated_time || myBid?.estimatedTime)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className={cn(
                                                "text-2xl font-black",
                                                myBid?.negotiatedAmount ? "text-amber-600" : "text-slate-900"
                                            )}>{myBid?.negotiatedAmount || myBid?.amount || '---'}</span>
                                            <span className="text-xs font-bold text-slate-400">ج.م</span>
                                            {myBid?.negotiatedAmount && (
                                                <span className="ml-2 text-[10px] line-through text-slate-300 font-bold">{myBid.amount} ج.م</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {hasMyBid ? (
                                    <div className="space-y-3">
                                        {myBid?.negotiatedAmount && !isOfferAccepted ? (
                                            <div className="space-y-3">
                                                {!showNegotiateInput ? (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <Button
                                                            onClick={handleAcceptNegotiatedPrice}
                                                            className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-bold text-xs shadow-md shadow-emerald-200 transition-all border-none"
                                                        >
                                                            <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" /> قبول العرض
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                setNegotiateAmount(myBid.negotiatedAmount.toString());
                                                                setShowNegotiateInput(true);
                                                            }}
                                                            variant="outline"
                                                            className="flex-1 h-12 text-amber-600 border-amber-500 hover:bg-amber-50 rounded-md font-bold text-xs transition-all"
                                                        >
                                                            تفاوض مرة أخرى
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3 p-4 bg-amber-50/50 rounded-md border border-amber-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-black text-amber-600 uppercase pr-1">سعرك الجديد</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    value={negotiateAmount}
                                                                    autoFocus
                                                                    onChange={(e) => setNegotiateAmount(e.target.value)}
                                                                    className="w-full h-11 bg-white border-2 border-amber-100 focus:border-amber-500 rounded-md px-4 text-sm font-black transition-all outline-none"
                                                                    placeholder="0.00"
                                                                />
                                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">ج.م</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 pt-1">
                                                            <Button
                                                                onClick={handleNegotiateSubmit}
                                                                disabled={updating}
                                                                className="flex-1 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-bold text-xs shadow-md shadow-amber-200"
                                                            >
                                                                {updating ? <Loading minimal={true} className="text-white" /> : 'تأكيد العرض'}
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setShowNegotiateInput(false);
                                                                    setNegotiateAmount('');
                                                                }}
                                                                variant="ghost"
                                                                className="h-10 px-3 text-slate-400 font-bold text-[10px] hover:bg-slate-100 rounded-md"
                                                            >
                                                                إلغاء
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (isOfferAccepted && isPickupInProgress) ? (
                                            <Button
                                                onClick={handleStartNavigation}
                                                disabled={updating}
                                                className="w-full h-14 bg-slate-900 text-white rounded-md font-black text-base shadow-lg hover:bg-slate-800 transition-all border-none flex items-center justify-center gap-2"
                                            >
                                                {updating ? <Loading minimal={true} className="text-white" /> : (
                                                    <><Navigation className="h-5 w-5" /> بدأ الملاحة</>
                                                )}
                                            </Button>
                                        ) : (isOfferAccepted && isDeliveryInProgress) ? (
                                            <Button
                                                onClick={handleArrived}
                                                disabled={updating}
                                                className="w-full h-14 bg-teal-600 text-white rounded-md font-black text-base shadow-lg hover:bg-teal-700 transition-all border-none flex items-center justify-center gap-2"
                                            >
                                                {updating ? <Loading minimal={true} className="text-white" /> : (
                                                    <><MapPin className="h-5 w-5" /> تأكيد الوصول</>
                                                )}
                                            </Button>
                                        ) : (isOfferAccepted && isArrived) ? (
                                            <Button
                                                onClick={handleCompleteDelivery}
                                                disabled={updating}
                                                className="w-full h-14 bg-emerald-600 text-white rounded-md font-black text-base shadow-lg hover:bg-emerald-700 transition-all border-none flex items-center justify-center gap-2"
                                            >
                                                {updating ? <Loading minimal={true} className="text-white" /> : (
                                                    <><CheckCircle2 className="h-5 w-5" /> إتمام التوصيل</>
                                                )}
                                            </Button>
                                        ) : isDelivered ? (
                                            <div className="w-full h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md flex items-center justify-center gap-2 font-black text-sm shadow-sm transition-all duration-300">
                                                <ShieldCheck className="h-5 w-5" />
                                                تم تسليم الشحنة بنجاح
                                            </div>
                                        ) : (
                                            <div className="w-full h-14 bg-emerald-50/50 text-emerald-600 border border-emerald-100 rounded-md flex items-center justify-center gap-2 font-black text-sm shadow-sm transition-all duration-300">
                                                <CheckCircle2 className="h-5 w-5" />
                                                {isOfferAccepted ? 'تم قبول عرضك' : 'تم تقديم عرضك'}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setShowBidModal(true)}
                                        className="w-full h-14 bg-brand-primary text-white rounded-md font-black text-base shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all border-none"
                                    >
                                        تقديم عرض
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
                <DialogContent
                    className="w-[92%] sm:max-w-[440px] rounded-md p-0 overflow-hidden font-cairo shadow-2xl border-none bg-white [&>button]:right-auto [&>button]:left-4"
                    dir="rtl"
                >
                    <div className="p-7 pb-3 bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-brand-primary/10 text-brand-primary rounded-md flex items-center justify-center">
                                <Clock className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-xl font-black text-slate-900">تقديم عرض سعر</DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-400 font-bold pr-14 text-xs leading-relaxed">
                            أدخل تفاصيل عرضك المالي والزمني للعميل.
                        </DialogDescription>
                    </div>

                    <form onSubmit={handleSubmitBid} className="p-7 pt-4 space-y-5">
                        {/* Price Input */}
                        <div className="space-y-2">
                            <label className={cn(
                                "text-sm font-bold block pr-1",
                                bidErrors.amount ? "text-red-500" : "text-slate-600"
                            )}>السعر المقترح (جنيه)</label>
                            <input
                                type="number"
                                value={bidForm.amount}
                                autoFocus
                                onChange={(e) => {
                                    setBidForm({ ...bidForm, amount: e.target.value });
                                    if (bidErrors.amount) setBidErrors({ ...bidErrors, amount: null });
                                }}
                                className={cn(
                                    "w-full h-12 bg-white border-2 rounded-md px-5 text-lg font-black transition-all outline-none",
                                    bidErrors.amount ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-brand-primary"
                                )}
                                placeholder="0.00"
                            />
                            {bidErrors.amount && <p className="text-[10px] font-bold text-red-500 pr-1">{bidErrors.amount}</p>}
                        </div>

                        {/* Detailed Time Grid */}
                        <div className="space-y-2">
                            <label className={cn(
                                "text-sm font-bold block pr-1",
                                bidErrors.time ? "text-red-500" : "text-slate-600"
                            )}>الوقت المتوقع للتوصيل</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { key: 'days', label: 'أيام' },
                                    { key: 'hours', label: 'ساعات' },
                                    { key: 'minutes', label: 'دقائق' }
                                ].map((t) => (
                                    <div key={t.key} className="space-y-2 text-center group">
                                        <input
                                            type="number"
                                            min="0"
                                            value={bidForm[t.key]}
                                            onChange={(e) => {
                                                setBidForm({ ...bidForm, [t.key]: e.target.value });
                                                if (bidErrors.time) setBidErrors({ ...bidErrors, time: null });
                                            }}
                                            className={cn(
                                                "w-full h-10 bg-white border-2 rounded-md px-2 text-center font-black text-slate-700 outline-none transition-all",
                                                bidErrors.time ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-brand-primary"
                                            )}
                                            placeholder="0"
                                        />
                                        <p className="text-[10px] font-black text-slate-400 uppercase group-focus-within:text-brand-primary transition-colors">{t.label}</p>
                                    </div>
                                ))}
                            </div>
                            {bidErrors.time && <p className="text-[10px] font-bold text-red-500 pr-1">{bidErrors.time}</p>}
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 block pr-1">ملاحظات إضافية (اختياري)</label>
                            <textarea
                                value={bidForm.note || ''}
                                onChange={(e) => setBidForm({ ...bidForm, note: e.target.value })}
                                className="w-full h-24 bg-white border-2 border-slate-100 focus:border-brand-primary rounded-md px-5 py-3 font-bold text-xs transition-all outline-none resize-none"
                                placeholder="أي ملاحظات إضافية للعميل..."
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                type="submit"
                                disabled={submittingBid}
                                className="flex-1 h-12 bg-brand-primary text-white rounded-md font-black text-sm shadow-lg shadow-brand-primary/10 transition-all border-none"
                            >
                                {submittingBid ? <Loading minimal={true} className="text-white" /> : 'تقديم العرض'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowBidModal(false)}
                                className="flex-1 h-12 text-slate-400 font-bold hover:bg-slate-50 rounded-md transition-all text-sm"
                            >
                                إلغاء
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

