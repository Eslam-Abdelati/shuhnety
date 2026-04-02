import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, Slide, Box } from '@mui/material';

const NotificationContext = createContext(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// This component is now globally fixed at the top of the viewport
export const GlobalNotification = () => {
    const { open, notification, hideNotification } = useNotification();

    return (
        <Slide in={open} direction="down" mountOnEnter unmountOnExit>
            <Box sx={{
                width: '100%',
                zIndex: 1000, 
                position: 'relative', // Relative to the main area container
                mb: 0 // No bottom margin for seamless look
            }}>
                <Alert
                    onClose={hideNotification}
                    severity={notification.severity}
                    variant="standard"
                    action={notification.action}
                    sx={{
                        width: '100%',
                        borderRadius: 0, // No rounding as requested
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        fontFamily: 'Cairo, sans-serif',
                        border: '1px solid',
                        borderColor: notification.severity === 'success' ? 'rgba(30, 70, 32, 0.15)' :
                            notification.severity === 'error' ? 'rgba(95, 33, 32, 0.15)' :
                                notification.severity === 'warning' ? 'rgba(102, 60, 0, 0.15)' : 'rgba(1, 67, 97, 0.15)',
                        backgroundColor: notification.severity === 'success' ? '#edf7ed' :
                            notification.severity === 'error' ? '#fdeded' :
                                notification.severity === 'warning' ? '#fff4e5' : '#e5f6fd',
                        color: notification.severity === 'success' ? '#1e4620' :
                            notification.severity === 'error' ? '#5f2120' :
                                notification.severity === 'warning' ? '#663c00' : '#014361',
                        display: 'flex',
                        alignItems: 'center',
                        py: 0.2, // Ultra-thin layout
                        px: { xs: 2, md: 4 },
                        minHeight: '40px', // Very slim height
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        '& .MuiAlert-icon': {
                            fontSize: '18px', // Smaller icon
                            opacity: 0.8,
                            mr: 1.5,
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center'
                        },
                        '& .MuiAlert-message': {
                            width: '100%',
                            textAlign: 'right',
                            pr: 1,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 0.5,
                            whiteSpace: 'normal',
                            overflow: 'visible',
                            py: 1
                        },
                        '& .MuiAlert-action': {
                            padding: '0 0 0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            mr: -0.5,
                            ml: 2,
                            '& .MuiButton-root': {
                                fontWeight: 800,
                                fontSize: '0.7rem',
                                color: 'inherit',
                                fontFamily: 'Cairo, sans-serif',
                                py: 0
                            },
                            '& .MuiIconButton-root': {
                                color: 'inherit',
                                opacity: 0.5,
                                padding: '2px'
                            },
                            '& .MuiSvgIcon-root': {
                                fontSize: '16px' // Smaller close icon
                            }
                        }
                    }}
                >
                    {notification.title && (
                        <span style={{ fontWeight: 900, marginLeft: '6px', opacity: 0.9 }}>
                            {notification.title}:
                        </span>
                    )}
                    <span style={{ opacity: 0.85 }}>{notification.message}</span>
                </Alert>
            </Box>
        </Slide>
    );
};

export const NotificationProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState({
        message: '',
        severity: 'info',
        title: '',
        action: null
    });

    const hideNotification = useCallback(() => setOpen(false), []);

    const showNotification = useCallback((params, type = 'info', title = '', action = null) => {
        if (typeof params === 'string') {
            setNotification({
                message: params,
                severity: type,
                title: title,
                action: action
            });
        } else {
            setNotification({
                message: params.message || '',
                severity: params.severity || type || 'info',
                title: params.title || '',
                action: params.action || null
            });
        }
        setOpen(true);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification, notification, open }}>
            {children}
        </NotificationContext.Provider>
    );
};
