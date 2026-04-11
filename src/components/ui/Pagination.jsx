import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Reusable Pagination Component (Exact Customer-Mirror Style)
 * Standardized for the entire Shohnety platform.
 * Stripped of animations for maximum stability.
 */
export const Pagination = ({ 
    currentPage, 
    onPageChange, 
    loading = false,
    hasMore = false,
    className
}) => {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    }

    const handleNext = () => {
        if (hasMore) onPageChange(currentPage + 1);
    }

    return (
        <div
            className={cn("flex items-center justify-center gap-3 md:gap-4 mt-12 mb-10 w-full font-cairo", className)}
            dir="rtl"
        >
            <button
                onClick={handlePrev}
                disabled={currentPage === 1 || loading}
                className="flex items-center justify-center gap-1.5 px-4 md:px-5 h-9 md:h-10 rounded-full text-[10px] md:text-[11px] font-black text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-primary/10 hover:text-brand-primary disabled:opacity-40 disabled:pointer-events-none transition-all ring-1 ring-slate-100 dark:ring-slate-800 hover:ring-brand-primary/20 shadow-sm"
            >
                <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                السابق
            </button>

            <div className="flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full font-black text-brand-primary bg-brand-primary/10 text-[11px] md:text-sm ring-4 ring-brand-primary/5 shadow-inner">
                {currentPage}
            </div>

            <button
                onClick={handleNext}
                disabled={!hasMore || loading}
                className="flex items-center justify-center gap-1.5 px-4 md:px-5 h-9 md:h-10 rounded-full text-[10px] md:text-[11px] font-black text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-primary/10 hover:text-brand-primary disabled:opacity-40 disabled:pointer-events-none transition-all ring-1 ring-slate-100 dark:ring-slate-800 hover:ring-brand-primary/20 shadow-sm"
            >
                التالي
                <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
        </div>
    )
}

