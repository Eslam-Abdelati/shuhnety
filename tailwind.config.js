/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                'brand-primary': 'var(--color-brand-primary)',
                'brand-secondary': 'var(--color-brand-secondary)',
                'brand-background': 'var(--color-brand-background)',
                'white-base': 'var(--color-white-base)',

                'ui-success': 'var(--color-ui-success)',
                'ui-warning': 'var(--color-ui-warning)',
                'ui-error': 'var(--color-ui-error)',
                'ui-info': 'var(--color-ui-info)',

                'lp-primary': 'var(--color-lp-primary)',
                'lp-secondary': 'var(--color-lp-secondary)',
                'lp-background': 'var(--color-lp-background)',
                'lp-on-background': 'var(--color-lp-on-background)',
                'lp-primary-fixed': 'var(--color-lp-primary-fixed)',
                'lp-surface-variant': 'var(--color-lp-surface-variant)',
                'lp-surface-container-lowest': 'var(--color-lp-surface-container-lowest)',
                'lp-surface-container-high': 'var(--color-lp-surface-container-high)',
                'lp-surface-container': 'var(--color-lp-surface-container)',
                'lp-on-surface-variant': 'var(--color-lp-on-surface-variant)',
                'lp-on-surface': 'var(--color-lp-on-surface)',
                'lp-on-primary': 'var(--color-lp-on-primary)',
                'lp-on-secondary': 'var(--color-lp-on-secondary)',
                'lp-outline-variant': 'var(--color-lp-outline-variant)',
                'lp-surface': 'var(--color-lp-surface)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}
