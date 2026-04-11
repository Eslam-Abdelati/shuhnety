import {
    Truck,
    Users,
    Clock,
    ShieldCheck,
    Search,
    Plus,
    Filter,
    MoreVertical,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/utils/cn'

export const FleetManagement = () => {
    const stats = [
        { label: 'إجمالي المركبات', value: '24', icon: Truck, color: 'blue' },
        { label: 'نشطة حالياً', value: '18', icon: Truck, color: 'emerald' },
        { label: 'في الصيانة', value: '3', icon: AlertCircle, color: 'amber' },
        { label: 'كباتن متاحين', value: '15', icon: Users, color: 'purple' },
    ]

    const vehicles = [
        { id: 'TRK-201', type: 'نقل ثقيل', driver: 'أحمد محمود', status: 'نشط', lastTrip: 'منذ ساعتين', plate: 'أ ب ج 123' },
        { id: 'TRK-202', type: 'جامبو', driver: 'مصطفى سيد', status: 'صيانة', lastTrip: 'أمس', plate: 'س ص ع 456' },
        { id: 'TRK-203', type: 'فان', driver: 'خالد علي', status: 'متاح', lastTrip: 'منذ 5 ساعات', plate: 'ق ر و 789' },
        { id: 'TRK-204', type: 'نقل ثقيل', driver: 'ياسر كمال', status: 'نشط', lastTrip: 'منذ ساعة', plate: 'ب ل ص 101' },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">إدارة الأسطول</h1>
                    <p className="text-slate-500 font-medium">متابعة حالة الشاحنات والكباتن والمهام النشطة</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl gap-2 h-12">
                        <Filter className="h-5 w-5" />
                        تصفية
                    </Button>
                    <Button className="rounded-xl gap-2 h-12 shadow-xl shadow-brand-primary/20">
                        <Plus className="h-5 w-5" />
                        إضافة مركبة
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                                s.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                    s.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                                        s.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"
                            )}>
                                <s.icon className="h-6 w-6" />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className="text-3xl font-black text-slate-900 mt-1">{s.value}</h4>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-slate-900">المركبات</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="بحث برقم الشاحنة أو اسم الكابتن..."
                            className="w-full bg-slate-50 border-none rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-6 py-4">رقم الشاحنة</th>
                                <th className="px-6 py-4">النوع</th>
                                <th className="px-6 py-4">اللوحة</th>
                                <th className="px-6 py-4">الكابتن</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4">آخر نشاط</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {vehicles.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-brand-primary">{v.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-600">{v.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{v.plate}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-xs">
                                                {v.driver.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{v.driver}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase",
                                            v.status === 'نشط' ? "bg-emerald-50 text-emerald-600" :
                                                v.status === 'متاح' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-slate-400">{v.lastTrip}</span>
                                    </td>
                                    <td className="px-6 py-4 text-left">
                                        <button className="p-2 text-slate-300 hover:text-brand-primary transition-colors">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

