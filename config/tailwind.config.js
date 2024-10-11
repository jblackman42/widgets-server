/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',  // Enable JIT mode
  content: [
    "./customWidgets.jsx",
    "./client/**/*.jsx",
    "./client/components/*.jsx",
    "./client/widgets/*.jsx"
  ],  // Watch all JSX files in the src directory and its subdirectories
  theme: {
    screens: {
      'sm': '512px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        "smoky": "#000000de",
        "accent": "#7B2D26",
        "destructive": "#c0392b",
        "smoky-destructive": "#e74c3c66",
        "warning": "#f9ca24",
        "smoky-warning": "#f9ca2466",
        "success": "#27ae60",
        "grayed-out": "#919191",
        "input": "#ecf0f1"
      },
      keyframes: {
        "slide-in-top": {
          from: { opacity: "0", transform: "translate(0,-100%)" },
          to: { opacity: "1", transform: "translate(0,0)" }
        },
        "slide-in-bottom": {
          from: { opacity: "0", transform: "translate(0,100%)" },
          to: { opacity: "1", transform: "translate(0,0)" }
        },
        "slide-out-top": {
          from: { opacity: "1", transform: "translate(0,0)" },
          to: { opacity: "0", transform: "translate(0,-100%)" }
        },
        "slide-out-bottom": {
          from: { opacity: "1", transform: "translate(0,0)" },
          to: { opacity: "0", transform: "translate(0,100%)" }
        },
      },
      animation: {
        "slide-in-top": "slide-in-top 175ms ease-in-out forwards",
        "slide-in-bottom": "slide-in-bottom 175ms ease-in-out forwards",
        "slide-out-top": "slide-out-top 175ms ease-in-out forwards",
        "slide-out-bottom": "slide-out-bottom 175ms ease-in-out forwards",
      },
    },
  },
  plugins: [],
}