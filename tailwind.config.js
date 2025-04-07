/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#6F56FF",
        secondary: "#FFEB9C",
        red: "#CB3D3D",
      },
      borderRadius: {
        xxl: "50px",
      },
      zIndex: {
        max: "99999",
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      }
    },
  },
  plugins: [],
};
