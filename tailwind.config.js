/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#6F56FF",
        secondary: "#FFEB9C",
      },
      borderRadius: {
        xxl: "50px",
      },
    },
  },
  plugins: [],
};
