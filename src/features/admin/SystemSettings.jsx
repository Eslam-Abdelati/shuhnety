import { useState } from 'react'
import {
    Settings,
    Shield,
    DollarSign,
    Globe,
    Bell,
    Mail,
    Phone,
    Save,
    RefreshCw,
    Lock,
    Unlock,
    Activity,
    CreditCard,
    CheckCircle2,
    XCircle,
    Server
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { cn } from '@/utils/cn'

export const SystemSettings = () => {
    const [activeTab, setActiveTab] = useState('fees')
    const [saving, setSaving] = useState(false)

    const handleSave = () => {
        setSaving(true)
        setTimeout(() => {
            setSaving(false)
            toast.success('تم تحديث إعدادات المنصة بنجاح وتطبيقها على النظام');
        }, 1500)
    }

    const tabs = [
        { id: 'fees', label: 'الرسوم والعمولات', icon: DollarSign },
        { id: 'security', label: 'الأمان والحماية', icon: Shield },
        { id: 'notifications', label: 'الإشعارات والتنبيهات', icon: Bell },
        { id: 'contact', label: 'معلومات التواصل', icon: Phone },
        { id: 'system', label: 'حالة النظام', icon: Server },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-cairo">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">إعدادات المنصة المركزية</h1>
                    <p className="text-sm font-bold text-slate-500 mr-1">تحكم كامل في بارامترات النظام والقواعد المالية والأمنية</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
                {/* Tabs / Sidebar */}
                <div className="lg:col-span-3 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full p-4 rounded-2xl flex items-center gap-3 transition-all text-right group",
                                activeTab === tab.id 
                                    ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-[1.02] border-brand-primary" 
                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-xl flex items-center justify-center transition-colors",
                                activeTab === tab.id ? "bg-white/20" : "bg-slate-50 text-slate-400 group-hover:text-brand-primary"
                            )}>
                                <tab.icon className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest leading-none">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <Card className="rounded-[3rem] border-none shadow-sm ring-1 ring-slate-100 overflow-hidden bg-white">
                        <CardContent className="p-10 space-y-10">
                            {activeTab === 'fees' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4">القواعد المالية والعمولات</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">عمولة المنصة من الكابتن (%)</label>
                                            <div className="relative">
                                                <input type="number" defaultValue="10" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all text-right" />
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">ضريبة القيمة المضافة (%)</label>
                                            <div className="relative">
                                                <input type="number" defaultValue="14" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all text-right" />
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الحد الأدنى للمزايدة (ج.م)</label>
                                            <div className="relative">
                                                <input type="number" defaultValue="500" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all text-right" />
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">ج.م</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رسوم فتح المزاد (ج.م)</label>
                                            <div className="relative">
                                                <input type="number" defaultValue="25" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all text-right" />
                                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">ج.م</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10 flex items-start gap-4">
                                        <div className="h-10 w-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/20">
                                            <Activity className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-brand-primary leading-tight">تنبيه المزامنة المالية</p>
                                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed text-right">تعديل هذه القيم سيؤثر على المزادات الجديدة فقط. المزادات الجارية ستحافظ على قواعدها القديمة حتى الانتهاء.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-8">
                                    <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4">إعدادات الأمان والحماية</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'تفعيل التحقق بخطوتين (2FA)', desc: 'إجبار مديري النظام والمستخدمين الحساسين على تفعيل رمز الدخول الإضافي', active: true },
                                            { label: 'تشفير المستندات المرفوعة', desc: 'استخدام تشفير AES-256 لكافة مستندات الكباتن والشركات', active: true },
                                            { label: 'وضع الصيانة للمنصة', desc: 'إيقاف كافة العمليات مؤقتاً لإجراء تحديثات طارئة أو صيانة مجدولة', active: false },
                                        ].map((setting, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50">
                                                <div className="space-y-1">
                                                    <p className="font-black text-sm text-slate-800 tracking-tight">{setting.label}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 pr-1 truncate max-w-[280px] md:max-w-md">{setting.desc}</p>
                                                </div>
                                                <button className={cn(
                                                    "w-14 h-8 rounded-full transition-all relative flex items-center px-1",
                                                    setting.active ? "bg-emerald-500 shadow-md shadow-emerald-200" : "bg-slate-200"
                                                )}>
                                                    <div className={cn(
                                                        "h-6 w-6 bg-white rounded-full shadow-sm transition-transform duration-300",
                                                        setting.active ? "-translate-x-6" : "translate-x-0"
                                                    )} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer Container for Save Button */}
                            <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
                                <p className="text-[10px] font-bold text-slate-400">آخر تحديث: منذ {activeTab === 'fees' ? '3 أيام' : 'أسبوعين'}</p>
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" className="h-12 px-6 rounded-2xl text-slate-400 font-bold text-xs">إعادة ضبط المصنع</Button>
                                    <Button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="h-12 px-8 rounded-2xl bg-brand-primary text-white font-black text-xs shadow-xl shadow-brand-primary/20 flex items-center gap-2"
                                    >
                                        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

