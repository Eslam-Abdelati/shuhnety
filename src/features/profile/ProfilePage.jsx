import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Shield, Camera,
    Edit2, CheckCircle2, Star, Wallet, Package,
    Truck, Calendar, ArrowLeft, ShieldCheck, Box,
    Briefcase, Globe, Settings, Bell, Lock,
    CreditCard, MapPinned, Hash, Info,
    ChevronRight, ExternalLink, Award, Share2,
    LogOut, Smartphone, Fingerprint, Eye, EyeOff
} from 'lucide-react';
import { getVehicleTypeLabel } from '@/utils/shipmentUtils';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

export const ProfilePage = () => {
    const { user, role, logout } = useAuthStore();
    const [activeSection, setActiveSection] = useState('profile');

    const menuItems = [
        { id: 'profile', label: 'المعلومات الشخصية', icon: User, color: 'emerald' },
        { id: 'wallet', label: 'المحفظة والتمويل', icon: Wallet, color: 'blue' },
        { id: 'security', label: 'كلمة المرور والأمان', icon: Shield, color: 'rose' },
        { id: 'notifications', label: 'تفضيلات الإشعارات', icon: Bell, color: 'amber' },
    ];

    if (role === 'driver') {
        menuItems.splice(1, 0, { id: 'vehicle', label: 'بيانات المركبة', icon: Truck, color: 'indigo' });
    }

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const sectionVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div className="font-cairo text-right" dir="rtl">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto"
            >
                {/* Main Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                        الصفحة الشخصية
                    </h1>
                    <p className="text-sm font-bold text-slate-400 mt-1">إدارة معلوماتك الشخصية وتفضيلات الحساب</p>
                </div>

                {/* Modern Unified Profile Container */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">

                    {/* Side Navigation Panel */}
                    <div className="w-full lg:w-72 bg-slate-50/50 dark:bg-slate-950/30 border-l border-slate-100 dark:border-slate-800 p-6 flex flex-col">

                        {/* User Identity Preview */}
                        <div className="text-center mb-8">
                            <div className="relative inline-block group">
                                <div className="h-24 w-24 rounded-3xl bg-white dark:bg-slate-800 p-1 shadow-md mx-auto">
                                    <div className="h-full w-full rounded-[1.2rem] bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center text-brand-primary overflow-hidden">
                                        {(user?.driverDetails?.profile_picture || user?.avatar) ? (
                                            <img src={user?.driverDetails?.profile_picture || user?.avatar} alt={user.full_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-10 w-10 stroke-[1.5]" />
                                        )}
                                    </div>
                                </div>
                                <button className="absolute -bottom-1 -left-1 h-8 w-8 bg-brand-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <h2 className="mt-4 text-lg font-black text-slate-800 dark:text-white leading-tight">
                                {user?.full_name || 'مستخدم النظام'}
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                                {role === 'driver' ? 'كابتن شحنتي' : 'حساب عميل'}
                            </p>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="flex-1 space-y-1.5">
                            {menuItems.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-white dark:bg-slate-800 text-brand-primary shadow-sm border border-slate-100 dark:border-slate-700 font-black"
                                                : "text-slate-500 hover:text-brand-primary font-bold"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                                            isActive ? "bg-brand-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                                        )}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-[13px]">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Footer Action */}
                        <div className="mt-8">

                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                variants={sectionVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="max-w-3xl"
                            >
                                {activeSection === 'profile' && (
                                    <div className="space-y-10">
                                        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-5">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-800 dark:text-white">المعلومات الشخصية</h3>
                                                <p className="text-slate-400 text-xs font-bold mt-1">عرض وتعديل معلومات حسابك الأساسية</p>
                                            </div>
                                            <Button variant="outline" className="h-9 rounded-lg border-slate-200 text-[11px] font-black px-4">
                                                تعديل
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10 pt-2">
                                            {[
                                                { label: 'الاسم بالكامل', value: user?.full_name, icon: User },
                                                { label: 'البريد الإلكتروني', value: user?.email, icon: Mail },
                                                { label: 'رقم الجوال', value: user?.phone_number, icon: Phone },
                                                { label: 'المحافظة', value: user?.governorate?.name_ar || 'غير محدد', icon: MapPinned },
                                                { label: 'المدينة', value: user?.city?.name_ar || 'غير محدد', icon: MapPinned },
                                                { label: 'العنوان', value: user?.address || 'غير محدد', icon: MapPin },
                                                { label: 'تاريخ الميلاد', value: user?.birth_date, icon: Calendar },
                                                ...(role === 'driver' ? [{ label: 'الرقم القومي', value: user?.driverDetails?.national_id, icon: CreditCard }] : []),
                                            ].map((field, i) => (
                                                <div key={i} className="group cursor-pointer">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 transition-colors group-hover:text-brand-primary">
                                                        <field.icon className="h-2.5 w-2.5" /> {field.label}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-primary transition-colors">
                                                            {field.value || '---'}
                                                        </span>
                                                        <Edit2 className="h-2.5 w-2.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="h-px bg-slate-50 dark:bg-slate-800/50 mt-3 group-hover:bg-brand-primary/10 transition-colors"></div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Status Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 flex items-center gap-4">
                                                <div className="h-11 w-11 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                                    <CheckCircle2 className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-emerald-800 dark:text-emerald-400">حالة الحساب</p>
                                                    <p className="text-[11px] font-bold text-emerald-600/70">نشط وموثق بالكامل</p>
                                                </div>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex items-center gap-4">
                                                <div className="h-11 w-11 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                                                    <Award className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-indigo-800 dark:text-indigo-400">مستوى العضوية</p>
                                                    <p className="text-[11px] font-bold text-indigo-600/70">عضوية برونزية (مبتدئ)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'wallet' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">المحفظة والرصيد</h3>
                                        </div>

                                        <div className="relative p-8 rounded-[2rem] bg-slate-900 text-white overflow-hidden shadow-xl">
                                            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.03]"></div>
                                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">الرصيد المتاح</p>
                                                    <h4 className="text-3xl font-black tracking-tighter mb-1">{user?.wallet?.balance || '٠.٠٠'} <span className="text-base text-brand-primary mr-1">EGP</span></h4>
                                                    <p className="text-[11px] text-slate-500 font-bold">آخر عملية شحن: {user?.wallet?.last_topup || 'لم يتم شحن رصيد بعد'}</p>
                                                </div>
                                                <div className="flex flex-col gap-2.5">
                                                    <Button className="bg-brand-primary hover:bg-orange-600 text-white h-11 px-8 rounded-xl font-black shadow-lg shadow-brand-primary/20 text-xs">
                                                        شحن الرصيد
                                                    </Button>
                                                    <Button className="bg-white/5 backdrop-blur-md text-white border-white/10 hover:bg-white/10 h-11 px-8 rounded-xl font-black text-xs">
                                                        سحب الأموال
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                                                    <CreditCard className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <h5 className="font-black text-slate-800 dark:text-white text-[14px] mb-1.5">طرق الدفع</h5>
                                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4">أضف بطاقتك البنكية لتسهيل عمليات الدفع التلقائي.</p>
                                                <button className="text-[10px] font-black text-brand-primary flex items-center gap-1.5 hover:gap-2.5 transition-all">
                                                    إضافة بطاقة <ChevronRight className="h-3 w-3 rotate-180" />
                                                </button>
                                            </div>
                                            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 shadow-sm">
                                                    <Smartphone className="h-4 w-4 text-emerald-500" />
                                                </div>
                                                <h5 className="font-black text-slate-800 dark:text-white text-[14px] mb-1.5">فودافون كاش</h5>
                                                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4">اربط محفظتك الإلكترونية للسحب والإيداع الفوري.</p>
                                                <button className="text-[10px] font-black text-brand-primary flex items-center gap-1.5 hover:gap-2.5 transition-all">
                                                    ربط المحفظة <ChevronRight className="h-3 w-3 rotate-180" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'vehicle' && role === 'driver' && (
                                    <div className="space-y-10">
                                        <div className="flex items-center justify-between border-b pb-5 dark:border-slate-800">
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white">بيانات المركبة</h3>
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg uppercase tracking-widest">تحقق لحظي</span>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Compact Documentation Status */}
                                            <div className="bg-emerald-50/40 dark:bg-emerald-500/5 rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-500/10 flex items-center gap-4">
                                                <div className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shrink-0">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[13px] font-black text-emerald-800 dark:text-emerald-400 mb-0.5">حالة التوثيق</h4>
                                                    <p className="text-[11px] font-bold text-emerald-600/70">تم مراجعة بيانات رخصتك ومركبتك وهي صالحة وموثقة بالكامل في النظام.</p>
                                                </div>
                                            </div>

                                            {/* Vehicle Details Grid - 2 Columns */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4">
                                                {[
                                                    { label: 'نوع الشاحنة', value: getVehicleTypeLabel(user?.vehicleDetails?.[0]?.vehicle_type), icon: Truck },
                                                    { label: 'ماركة المركبة', value: user?.vehicleDetails?.[0]?.vehicle_brand || 'غير محدد', icon: Box },
                                                    { label: 'الموديل', value: user?.vehicleDetails?.[0]?.model || 'غير محدد', icon: Hash },
                                                    { label: 'رقم اللوحات', value: user?.vehicleDetails?.[0]?.vehicle_plate_number || 'غير محدد', icon: CreditCard },
                                                    { label: 'سنة الصنع', value: user?.vehicleDetails?.[0]?.manufacture_year || '---', icon: Calendar },
                                                    { label: 'اللون', value: user?.vehicleDetails?.[0]?.color || '---', icon: Info },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex gap-4 group">
                                                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                                            <item.icon className="h-5 w-5 text-indigo-500 group-hover:text-white" />
                                                        </div>
                                                        <div className="pt-1">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{item.label}</p>
                                                            <p className="text-[16px] font-black text-slate-700 dark:text-slate-100">{item.value}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'security' && (
                                    <div className="space-y-12">
                                        {/* Simple Header with Status */}
                                        <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-800 dark:text-white">الأمان والخصوصية</h3>
                                                <p className="text-slate-400 text-xs font-bold mt-1">إدارة حماية وسرية حسابك الشخصي</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                                <span className="text-[11px] font-black text-emerald-600">حسابك محمي</span>
                                            </div>
                                        </div>

                                        {/* Integrated List Layout */}
                                        <div className="space-y-10">
                                            {/* Security Strength Indicator */}
                                            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center justify-between mb-4">
                                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">قوة حماية الحساب</p>
                                                    <span className="text-[11px] font-black text-brand-primary">٧٠٪ - جيد جداً</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '70%' }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-gradient-to-l from-brand-primary to-orange-400"
                                                    />
                                                </div>
                                                <p className="mt-4 text-[11px] font-bold text-slate-400 leading-relaxed">
                                                    حسابك يتبع معايير أمان جيدة، يمكنك زيادة النسبة عبر تحديث كلمة المرور بشكل دوري.
                                                </p>
                                            </div>

                                            {/* Security Actions List */}
                                            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                <div className="py-6 flex items-center justify-between group cursor-pointer border-t border-slate-50 dark:border-slate-800">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-11 w-11 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 transition-transform group-hover:scale-110">
                                                            <Lock className="h-5 w-5 stroke-[1.5]" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[15px] font-black text-slate-800 dark:text-white mb-0.5 transition-colors group-hover:text-brand-primary">كلمة المرور</h4>
                                                            <p className="text-[11px] font-bold text-slate-400">آخر تغيير منذ ٣ أشهر</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" className="h-9 px-6 rounded-xl border-slate-200 text-[11px] font-black hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all">
                                                        تغيير الآن
                                                    </Button>
                                                </div>

                                                <div className="py-6 flex items-center justify-between group cursor-pointer">
                                                    <div className="flex items-center gap-5">
                                                        <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110">
                                                            <Shield className="h-5 w-5 stroke-[1.5]" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[15px] font-black text-slate-800 dark:text-white mb-0.5 transition-colors group-hover:text-brand-primary">سجل الدخول الأخير</h4>
                                                            <p className="text-[11px] font-bold text-slate-400">القاهرة، مصر - منذ ساعتين</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" className="h-9 px-4 rounded-xl text-[11px] font-black text-blue-500 hover:bg-blue-50">
                                                        عرض التفاصيل
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'notifications' && (
                                    <div className="space-y-12 text-center py-16">
                                        <div className="h-20 w-20 bg-amber-50 dark:bg-amber-500/5 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-amber-200 dark:border-amber-500/20">
                                            <Bell className="h-10 w-10 text-amber-500 animate-pulse" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none">إعدادات الإشعارات</h3>
                                        <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm leading-relaxed mt-4">
                                            قريباً ستتمكن من التحكم في أنواع الإشعارات التي تصلك (تنبيهات الشحن، العروض الجديدة، تحديثات الرصيد).
                                        </p>
                                        <button className="mt-8 text-[11px] font-black text-slate-300 cursor-not-allowed">
                                            الميزة قيد البرمجة حالياً
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

