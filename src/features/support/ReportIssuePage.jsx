import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AlertTriangle, MessageSquare, Package,
    Send, CheckCircle2, ChevronRight,
    HelpCircle, ShieldAlert, Clock,
    Image as ImageIcon, UploadCloud, Camera, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

export const ReportIssuePage = () => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        shipmentId: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
                return;
            }
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.type) {
            newErrors.type = 'يرجى اختيار نوع المشكلة';
        }
        if (!formData.description || formData.description.length < 10) {
            newErrors.description = 'يرجى كتابة وصف لا يقل عن 10 أحرف';
        }
        if (formData.type === 'مشكلة في شحنة' && !formData.shipmentId) {
            newErrors.shipmentId = 'رقم الشحنة مطلوب عند اختيار مشكلة في شحنة';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        // التظاهر بإرسال البيانات
        try {
            await new Promise(r => setTimeout(r, 1500));
            setSubmitted(true);
            toast.success('تم إرسال بلاغك بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء الإرسال');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">تم استلام بلاغك!</h2>
                <p className="text-slate-500 font-bold mb-10 leading-relaxed text-right">
                    فريق الدعم الفني والنزاعات سيبدأ في مراجعة المشكلة خلال أقل من 12 ساعة.
                    سنقوم بالتواصل معك عبر الإشعارات أو الهاتف في حال احتجنا لمزيد من التفاصيل.
                </p>
                <Button onClick={() => window.history.back()} className="rounded-2xl h-14 px-10 bg-slate-900 text-white font-black">
                    العودة للوحة التحكم
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pb-20 text-right" dir="rtl">
            {/* 1. Header Area Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        <MessageSquare className="h-3 w-3" />
                        الدعم الفني والشكاوى
                    </div>
                    <p className="text-slate-500 font-bold">فريقنا جاهز لمساعدتك في حل أي مشكلة تواجهك فوراً.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                        <HelpCircle className="h-5 w-5" />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الدعم المباشر</p>
                        <p className="text-sm font-black text-slate-700">متاح 24/7 للحالات الطارئة</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* 2. Right Section: Form (3 Columns) */}
                <div className="lg:col-span-3">
                    <Card className="rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
                        <CardContent className="p-8 md:p-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block pr-1">نوع المشكلة</label>
                                    <select
                                        value={formData.type}
                                        required
                                        onChange={(e) => {
                                            setFormData({ ...formData, type: e.target.value });
                                            if (errors.type) setErrors({ ...errors, type: null });
                                        }}
                                        className={cn(
                                            "w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-right cursor-pointer",
                                            errors.type && "ring-2 ring-rose-500/20 bg-rose-50/30 text-rose-500"
                                        )}
                                    >
                                        <option value="" disabled>اختر نوع المشكلة...</option>
                                        <option value="مشكلة في شحنة">مشكلة في شحنة</option>
                                        <option value="مشكلة في الدفع">مشكلة في الدفع</option>
                                        <option value="مشكلة مع سائق">مشكلة مع سائق</option>
                                        <option value="أخرى">أخرى</option>
                                    </select>
                                    {errors.type && <p className="text-[10px] font-bold text-rose-500 pr-2">{errors.type}</p>}
                                </div>

                                {formData.type === 'مشكلة في شحنة' && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2">
                                        <label className="text-sm font-bold text-slate-700 block pr-1">رقم الشحنة</label>
                                        <input
                                            type="text"
                                            value={formData.shipmentId}
                                            required={formData.type === 'مشكلة في شحنة'}
                                            onChange={(e) => {
                                                setFormData({ ...formData, shipmentId: e.target.value });
                                                if (errors.shipmentId) setErrors({ ...errors, shipmentId: null });
                                            }}
                                            className={cn(
                                                "w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-right",
                                                errors.shipmentId && "ring-2 ring-rose-500/20 bg-rose-50/30"
                                            )}
                                            placeholder="مثال: SH-8291"
                                        />
                                        {errors.shipmentId && <p className="text-[10px] font-bold text-rose-500 pr-2">{errors.shipmentId}</p>}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 block pr-1">وصف المشكلة بالتفصيل</label>
                                    <textarea
                                        rows={6}
                                        value={formData.description}
                                        required
                                        onChange={(e) => {
                                            setFormData({ ...formData, description: e.target.value });
                                            if (errors.description) setErrors({ ...errors, description: null });
                                        }}
                                        className={cn(
                                            "w-full bg-slate-50 border-none rounded-[2rem] px-6 py-5 font-bold text-sm outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none text-right",
                                            errors.description && "ring-2 ring-rose-500/20 bg-rose-50/30"
                                        )}
                                        placeholder="اشرح لنا ماذا حدث معك..."
                                    />
                                    {errors.description && <p className="text-[10px] font-bold text-rose-500 pr-2">{errors.description}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 block pr-1">إرفاق صورة (اختياري)</label>
                                    {!imagePreview ? (
                                        <div 
                                            onClick={() => document.getElementById('report_image').click()}
                                            className="border-2 border-dashed border-slate-200 hover:border-brand-primary/50 hover:bg-brand-primary/[0.02] rounded-[2rem] p-10 transition-all cursor-pointer group text-center"
                                        >
                                            <input 
                                                id="report_image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                            <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-brand-primary transition-colors" />
                                            </div>
                                            <p className="text-sm font-black text-slate-600 mb-1 group-hover:text-slate-900 transition-colors">اضغط هنا لرفع صورة للمشكلة</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PNG, JPG up to 5MB</p>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-[2rem] overflow-hidden group border border-slate-100 shadow-lg">
                                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <button 
                                                    type="button"
                                                    onClick={() => document.getElementById('report_image').click()}
                                                    className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center"
                                                    title="تغيير الصورة"
                                                >
                                                    <Camera className="h-6 w-6" />
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="h-12 w-12 rounded-xl bg-rose-500/20 backdrop-blur-md text-white border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                                                    title="حذف الصورة"
                                                >
                                                    <Trash2 className="h-6 w-6" />
                                                </button>
                                            </div>
                                            <input 
                                                id="report_image"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                    )}
                                </div>

                                <Button type="submit" disabled={submitting} className="w-full h-15 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20">
                                    {submitting ? "جاري الإرسال..." : "إرسال البلاغ"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Left Section: History & Info (2 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Part A: Recent History */}
                    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900">بلاغاتي السابقة</h3>
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase">History</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { id: '123', status: 'قيد المراجعة', date: '2024-03-10' },
                                { id: '122', status: 'تم الحل', date: '2024-03-05' },
                            ].map((report) => (
                                <div key={report.id} className="p-5 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-black text-slate-900">بلاغ {report.id}</span>
                                        <div className={cn(
                                            "px-2 py-1 rounded-lg text-[10px] font-black",
                                            report.status === 'تم الحل' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {report.status}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 block text-right">تاريخ التقديم: {report.date}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 text-center">
                            <Link to="../reports-history" className="text-xs font-black text-brand-primary">عرض جميع البلاغات</Link>
                        </div>
                    </div>

                    {/* Part B: Info Card */}
                    <div className="bg-brand-primary/5 border border-brand-primary/10 p-8 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-10 w-10 text-brand-primary" />
                            <h3 className="text-xl font-black text-brand-primary">لماذا نقدم البلاغ؟</h3>
                        </div>
                        <p className="text-slate-600 font-bold leading-relaxed text-sm">
                            منصة شحنتي تضمن حقوقك سواء كنت تاجراً أو كابتناً. نأخذ كل بلاغ على محمل الجد لضمان بيئة عمل عادلة وآمنة.
                        </p>
                        <ul className="space-y-3 pt-2">
                            {[
                                'مراجعة النزاعات المالية',
                                'حماية الحقوق القانونية',
                                'توثيق الاعتراضات'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <div className="h-1.5 w-1.5 bg-brand-primary rounded-full shrink-0"></div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
