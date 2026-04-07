import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset main window scroll immediately
        window.scrollTo(0, 0);
        
        // Find any overflow containers (like the main element in DashboardLayout) and reset them
        const scrollableContainers = document.querySelectorAll('main, .overflow-y-auto');
        scrollableContainers.forEach(container => {
            container.scrollTo({ top: 0 });
        });
    }, [pathname]);

    return null;
}
