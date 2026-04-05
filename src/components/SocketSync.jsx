import { useEffect } from 'react';
import { socketService } from '@/services/socketService';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { toast } from 'react-hot-toast';

export const SocketSync = () => {
    const { user, role } = useAuthStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }


        // --- 1. DEBUG TOOLS ---
        window.testSocket = () => {
            if (!socketService.socket?.connected) {
                socketService.connect('/notifications', { userId: user.id });
            }
            socketService.emit('ping_test', { userId: user.id });
        };

        window.mockNotification = (msg = 'إشعار تجريبي لاختبار الواجهة! 🔔') => {
            handleNotification({ title: 'تجربة', message: msg, type: 'info' });
        };

        // --- 2. THE HANDLER ---
        const handleNotification = (data) => {
            if (!data) return;

            // CLEAR & VISIBLE LOG FOR BACKEND DATA
            console.log("%c📡 [Socket Data from Backend]", "color: #00ff00; font-weight: bold; font-size: 14px;", data);

            const rawData = Array.isArray(data) ? (data[0] || {}) : data;
            
            if (!rawData || typeof rawData !== 'object') {
                console.warn("⚠️ Received invalid socket data structure:", data);
                return;
            }

            const title = rawData.title || 'تنبيه جديد';
            const message = rawData.message || rawData.desc || rawData.text || '';
            const type = rawData.severity || rawData.type || 'info';

            try {
                // Persistent storage
                if (role) {
                    addNotification({
                        title,
                        desc: message,
                        type: ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info',
                        recipientRole: role
                    });
                }
                // UI Toast
                if (type === 'success') toast.success(message);
                else if (type === 'error') toast.error(message);
                else toast(message, { icon: '🔔' });
            } catch (err) {
                // Keep error log
                console.error('❌ Error handling notification:', err);
            }
        };

        // --- 3. CONNECTION ---
        socketService.connect('/notifications', { userId: user.id });

        const onConnect = () => {
             // socketService.emit('join', user.id); 
        };

        socketService.on('connect', onConnect);
        if (socketService.socket?.connected) onConnect();

        // --- 4. EVENT LISTENERS ---
        const targetEvents = ['new_notification', 'notification', 'new_shipment'];
        targetEvents.forEach(evt => {
            socketService.on(evt, (data) => {
                handleNotification(data);
            });
        });

        return () => {
            if (socketService.socket) {
                socketService.socket.off('connect', onConnect);
                targetEvents.forEach(evt => socketService.socket.off(evt));
            }
            delete window.testSocket;
            delete window.mockNotification;
        };
    }, [user, role, addNotification]);

    return null;
};
