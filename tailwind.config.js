/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
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
				border: 'hsl(var(--varanda-beige-dark))', 
				input: 'hsl(var(--varanda-beige-dark))', 
				ring: 'hsl(var(--varanda-gold))', 
				background: 'hsl(var(--varanda-brown))', 
				foreground: 'hsl(var(--varanda-beige))', 
				primary: {
					DEFAULT: 'hsl(var(--varanda-gold))',
					foreground: 'hsl(var(--varanda-brown-dark))', 
				},
				secondary: {
					DEFAULT: 'hsl(var(--varanda-beige-light))', 
					foreground: 'hsl(var(--varanda-brown))',
				},
				destructive: {
					DEFAULT: 'hsl(0 72% 51%)', // vibrant red
					foreground: 'hsl(var(--varanda-beige-light))',
				},
				muted: {
					DEFAULT: 'hsl(var(--varanda-brown-light))', 
					foreground: 'hsl(var(--varanda-beige))', 
				},
				accent: {
					DEFAULT: 'hsl(var(--varanda-gold-light))', 
					foreground: 'hsl(var(--varanda-brown-dark))',
				},
				popover: {
					DEFAULT: 'hsl(var(--varanda-brown-light))', 
					foreground: 'hsl(var(--varanda-beige))', 
				},
				card: {
					DEFAULT: 'hsl(var(--varanda-brown-light))', 
					foreground: 'hsl(var(--varanda-beige))',
				},
			},
			borderRadius: {
				lg: '0.75rem', 
				md: 'calc(0.75rem - 2px)',
				sm: 'calc(0.75rem - 4px)',
			},
			fontFamily: {
				sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
				serif: ['Georgia', 'Times New Roman', 'serif'], 
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};