import { Upload } from 'lucide-react'
import { cn } from '@/utils/cn'

export const FileUpload = ({
    label,
    value,
    onChange,
    error,
    icon: Icon,
    className,
    helperText
}) => {
    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-[10px] font-black text-slate-500 block pr-1">{label}</label>}
            <label className={cn(
                "h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all overflow-hidden relative",
                error ? "border-red-500 bg-red-50/30" : "border-slate-200 hover:bg-slate-50"
            )}>
                {value ? (
                    <img src={value} className="absolute inset-0 w-full h-full object-cover" alt={label} />
                ) : (
                    <>
                        {Icon && (
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                                <Icon className="h-5 w-5 text-slate-300" />
                            </div>
                        )}
                        <Upload className="h-5 w-5 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400">تحميل {label}</span>
                        {helperText && <span className="text-[8px] font-bold text-slate-300">{helperText}</span>}
                    </>
                )}
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onChange}
                />
            </label>
            {error && <p className="text-[10px] text-red-500 font-bold pr-1">{error}</p>}
        </div>
    )
}
