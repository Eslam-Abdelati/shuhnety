import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

// To change the logo icon globally, modify this component
export const LogoIcon = ({ className = 'h-5 w-5' }) => {
    return (
        <img 
            src="/logo.png" 
            alt="شحنتي" 
            className={cn("object-contain", className)} 
        />
    )
}

// To change the brand name globally, change this string
export const BrandName = 'شحنتي'

export const Logo = ({ 
    className = '', 
    iconClassName = 'h-full w-full p-0.5', 
    boxClassName = 'h-10 w-10', 
    textClassName = 'text-2xl font-black text-brand-secondary tracking-tight',
    withText = true,
    noLink = false,
    to = '/'
}) => {
    const content = (
        <div className={cn("flex items-center gap-2.5", className)}>
            {/* Logo Icon Box */}
            <div className={cn(
                "bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden flex items-center justify-center shrink-0",
                boxClassName
            )}>
                <LogoIcon className={iconClassName} />
            </div>
            {/* Brand Text */}
            {withText && (
                <span className={textClassName}>{BrandName}</span>
            )}
        </div>
    )

    if (noLink) {
        return content
    }

    return (
        <Link to={to} className="hover:opacity-95 transition-opacity group">
            {content}
        </Link>
    )
}
