/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                airbnb: {
                    rausch: '#FF385C',
                    babu: '#00A699',
                    arches: '#FC642D',
                    hof: '#484848',
                    foggy: '#767676',
                },
                primary: {
                    DEFAULT: '#FF385C',
                    dark: '#E31C5F',
                    light: '#FF5A7D',
                },
                accent: {
                    DEFAULT: '#0073E6',
                    dark: '#0060C2',
                    light: '#3D93F5',
                },
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ],
            },
            boxShadow: {
                'airbnb': '0 2px 4px rgba(0,0,0,0.08)',
                'airbnb-hover': '0 4px 12px rgba(0,0,0,0.15)',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite',
                'fade-in': 'fadeIn 0.3s ease-in',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
