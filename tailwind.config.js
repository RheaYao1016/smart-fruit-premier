/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'fresh-green': {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80', // Primary Green
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                'warm-orange': {
                    50: '#fff7ed',
                    400: '#fb923c',
                    500: '#f97316', // Primary Orange
                    600: '#ea580c',
                },
                'cream': '#fdfbf7',
                'off-white': '#fcfcfc',
                'dark-text': '#1f2937'
            },
            fontFamily: {
                heading: ['"Noto Sans SC"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
