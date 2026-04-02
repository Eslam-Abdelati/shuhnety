import {
    Users,
    Search,
    Plus,
    Filter,
    Star,
    Phone,
    MapPin,
    MoreVertical,
    Briefcase,
    CheckCircle2,
    Clock
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export const DriverManagement = () => {
    const drivers = [
        {
            id: 1,
            name: 'أحمد كمال',
            rating: 4.8,
            status: 'في رحلة',
            location: 'طريق السويس',
            trips: 124,
            joined: '2023-05-10',
            phone: '01012345678'
        },
        {
            id: 2,
            name: 'محمود علي',
            rating: 4.5,
            status: 'متاح',
            location: 'القاهرة، مدينة نصر',
            trips: 85,
            joined: '2023-11-20',
            phone: '01112345678'
        },
        {
            id: 3,
            name: 'سيد إبراهيم',
            rating: 4.9,
            status: 'عطلة',
            location: 'الجيزة، الهرم',
            trips: 210,
            joined: '2022-01-15',
            phone: '01212345678'
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">إدارة السائقين</h1>
                    <p className="text-slate-500 font-medium">متابعة أداء السائقين، التقييمات، والمهام المسندة</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl gap-2 h-12">
                        <Filter className="h-5 w-5" />
                        تصفية
                    </Button>
                    <Button className="rounded-xl gap-2 h-12 shadow-xl shadow-brand-primary/20">
                        <Plus className="h-5 w-5" />
                        إضافة سائق جديد
                    </Button>
                </div>
            </div>

            {/* Driver Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                    <Card key={driver.id} className="group hover:-translate-y-1 transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-slate-400 font-black text-lg">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover:text-brand-primary transition-colors">{driver.name}</h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                                            <span className="text-sm font-black text-slate-700">{driver.rating}</span>
                                            <span className="text-xs text-slate-400 font-bold">({driver.trips} رحلة)</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-brand-primary transition-colors">
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4 py-6 border-y border-slate-50 mb-6">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">الحالة</span>
                                    <span className={cn(
                                        "font-black px-2 py-1 rounded-lg",
                                        driver.status === 'متاح' ? "bg-emerald-50 text-emerald-600" :
                                            driver.status === 'في رحلة' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
                                    )}>
                                        {driver.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">الموقع الحالي</span>
                                    <span className="text-slate-700 font-black flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 text-slate-300" />
                                        {driver.location}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">رقم الهاتف</span>
                                    <span className="text-slate-700 font-black flex items-center gap-1" dir="ltr">
                                        {driver.phone}
                                        <Phone className="h-3.5 w-3.5 text-slate-300" />
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" size="sm" className="rounded-xl font-bold bg-slate-50 border-none hover:bg-slate-100">سجل المهام</Button>
                                <Button size="sm" className="rounded-xl font-bold">إسناد مهمة</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Invite Section */}
            <Card className="bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <CardContent className="p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-right">
                        <h3 className="text-2xl font-black text-white mb-2">هل تبحث عن سائقين جدد؟</h3>
                        <p className="text-slate-400 font-medium">قم بدعوة سائقين للانضمام لشركة الشحن الخاصة بك وإدارتهم بسهولة تامة.</p>
                    </div>
                    <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-brand-secondary text-brand-primary hover:bg-amber-400 hover:scale-105 transition-all shadow-xl shadow-amber-500/10">
                        <Plus className="h-6 w-6 ml-2" />
                        إنشاء رابط دعوة
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
