/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        tektur: ['"Tektur"', "sans-serif"],
      },
      colors: {
        brand: "#57BFF5",
        "brand-light": "rgba(87,191,245,0.5)",
        "brand-disabled": "rgba(87,191,245,0.30)",
        secondary: "#F5C458",
        outline: "rgba(0,0,0,0.1)",
        disabled: "rgba(0,0,0,0.35)",
        text: "#34454D",
        dark: "#000000",
        light: "#FFFFFF",
        sky: "#60e3ff"
      },
      borderWidth: {
        12: "12px",
        16: "16px",
      },
      borderRadius: {
        "4xl": "2.2rem",
        xxl: "50px",
      },
      zIndex: {
        max: "99999",
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
      },
      flexGrow: {
        2: "2",
        3: "3",
      },
      flexShrink: {
        2: "2",
        3: "3",
      },
    },
  },
  plugins: [],
};
