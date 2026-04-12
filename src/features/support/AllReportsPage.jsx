import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, ChevronLeft, Calendar, 
    MessageSquare, AlertCircle, CheckCircle2, 
    XCircle, Clock, Package,
    ArrowRight, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { Link } from 'react-router-dom';

export const AllReportsPage = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    const reports = [
        { 
            id: '123', type: 'مشكلة في شحنة', status: 'قيد المراجعة', date: '2024-03-10', 
            shipment: 'SH-8291', description: 'تأخر الكابتن في الوصول لنقطة الاستلام لأكثر من ساعتين بدون أي تواصل مسبق.',
            reply: null
        },
        { 
            id: '122', type: 'مشكلة في الدفع', status: 'تم الحل', date: '2024-03-05', 
            shipment: 'SH-7750', description: 'لم يتم تحديث حالة الدفع بعد التحويل عبر فودافون كاش رغم مرور أكثر من 24 ساعة.',
            reply: 'شكراً لتواصلك معنا. تم التحقق من عملية التحويل وتحديث حالة الشحنة إلى "مدفوعة". نعتذر عن هذا التأخير الفني.'
        },
        { 
            id: '115', type: 'مشكلة مع سائق', status: 'مرفوض', date: '2024-02-28', 
            shipment: 'SH-9012', description: 'سلوك غير لائق من السائق عند التسليم ومحاولة تحصيل مبلغ إضافي غير المتفق عليه.',
            reply: 'بعد مراجعة البلاغ، تبين أن الرسوم كانت رسوم انتظار معتمدة. البلاغ مرفوض.'
        },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'تم الحل': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'قيد المراجعة': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'مرفوض': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const filteredReports = reports.filter(r => 
        (filter === 'all' || r.status === filter) &&
        (r.id.includes(searchQuery) || r.type.includes(searchQuery))
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 text-right" dir="rtl">
            {/* Header: Title Right, Button Left */}
            <div className="flex flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">سجل البلاغات الكامل</h1>
                    <p className="text-slate-500 font-bold">مراجعة وتتبع حالة كافة طلبات الدعم.</p>
                </div>
                <Button asChild className="rounded-2xl h-14 px-8 bg-brand-primary text-white font-black shadow-lg">
                    <Link to="../report">تقديم بلاغ جديد</Link>
                </Button>
            </div>

            {/* Filters & Search: Native RTL */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <input 
                        type="text" placeholder="ابحث برقم البلاغ..." 
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 bg-slate-50 border-none rounded-2xl pr-14 pl-6 font-bold text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 text-right"
                    />
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2">
                    {['all', 'قيد المراجعة', 'تم الحل', 'مرفوض'].map((s) => (
                        <button
                            key={s} onClick={() => setFilter(s)}
                            className={cn(
                                "whitespace-nowrap px-6 h-12 rounded-xl text-xs font-black border transition-all shrink-0",
                                filter === s ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                            )}
                        >
                            {s === 'all' ? 'الكل' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* List: Content Right, Status Left */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredReports.map((report) => (
                        <motion.div
                            key={report.id} layout
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-xl transition-all cursor-pointer"
                            onClick={() => setSelectedReport(report)}
                        >
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                {/* Info Section (Right in RTL) */}
                                <div className="flex-1 space-y-4 w-full">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0"><MessageSquare className="h-5 w-5" /></div>
                                        <div className="text-right flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="text-lg font-black text-slate-900">بلاغ {report.id}</h3>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border">{report.date}</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500">{report.type}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 leading-relaxed pr-14 line-clamp-1">
                                        {report.description}
                                    </p>
                                </div>

                                {/* Status & Action (Left in RTL) */}
                                <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 w-full lg:w-auto">
                                    <div className={cn("px-4 py-2 rounded-xl text-[10px] font-black border uppercase tracking-wider", getStatusStyles(report.status))}>
                                        {report.status}
                                    </div>
                                    <Button variant="ghost" size="sm" className="rounded-xl font-black text-xs text-brand-primary hover:bg-brand-primary/5 gap-2">
                                        عرض التفاصيل <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Original Detail Modal Design */}
            <AnimatePresence>
                {selectedReport && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setSelectedReport(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex items-start justify-between flex-row border-b border-slate-50 pb-6">
                                    <div className="text-right">
                                        <h2 className="text-2xl font-black text-slate-900 leading-tight">تفاصيل البلاغ {selectedReport.id}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-slate-400">{selectedReport.type}</span>
                                            <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                                            <span className="text-xs font-bold text-slate-400">{selectedReport.date}</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-2",
                                        getStatusStyles(selectedReport.status)
                                    )}>
                                      
                                        {selectedReport.status}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] space-y-3">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                           <MessageSquare className="h-3 w-3" />  وصف المشكلة 
                                        </h4>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                            {selectedReport.description}
                                        </p>
                                    </div>

                                    {selectedReport.reply ? (
                                        <div className="bg-brand-primary/5 border border-brand-primary/10 p-6 rounded-[2rem] space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                            <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
                                               <CheckCircle2 className="h-3 w-3" />  رد الدعم الفني 
                                            </h4>
                                            <p className="text-sm font-bold text-brand-primary leading-relaxed">
                                                {selectedReport.reply}
                                            </p>
                                            <div className="pt-2 text-[10px] font-black text-brand-primary/50 text-right">
                                                تم الرد في وقت سابق
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] text-right flex items-center justify-between">
                                            <Clock className="h-8 w-8 text-amber-500" />
                                            <div>
                                                <h4 className="text-sm font-black text-amber-700">جاري مراجعة البلاغ</h4>
                                                <p className="text-xs font-bold text-amber-600/70">فريقنا يعمل حالياً على فحص المشكلة والرد عليك فورا.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center">
                                    <Button 
                                        onClick={() => setSelectedReport(null)}
                                        className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-black/10 transition-all hover:bg-black"
                                    >
                                        إغلاق النافذة
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
